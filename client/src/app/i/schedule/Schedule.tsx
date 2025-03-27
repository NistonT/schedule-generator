"use client";
import { useProfile } from "@/hook/useProfile";
import { scheduleService } from "@/services/schedule.service";
import {
	closestCenter,
	DndContext,
	DragEndEvent,
	DragStartEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Calendar, Clock, MapPin, User } from "lucide-react";
import { useEffect, useState } from "react";

interface ScheduleData {
	groupTimetables: {
		[group: string]: {
			[day: string]: Array<Array<any>>;
		};
	};
}

const SortableItem = ({
	id,
	children,
}: {
	id: string;
	children: React.ReactNode;
}) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition: transition || undefined,
		opacity: isDragging ? 0.5 : 1,
		zIndex: isDragging ? 100 : "auto",
	};

	return (
		<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
			{children}
		</div>
	);
};

export const Schedule = () => {
	const { data: profileData } = useProfile();
	const [schedule, setSchedule] = useState<ScheduleData | null>(null);
	const [activeId, setActiveId] = useState<string | null>(null);

	const { data: scheduleData, isPending } = useQuery({
		queryKey: ["querySchedule"],
		queryFn: () => scheduleService.getSchedule(profileData!.api_key),
		select: data => data.data,
		enabled: !!profileData?.api_key,
	});

	useEffect(() => {
		if (scheduleData) setSchedule(scheduleData.schedule as any);
	}, [scheduleData]);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
	);

	const handleDragStart = (event: DragStartEvent) => {
		setActiveId(event.active.id as string);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || !schedule || active.id === over.id) return;

		const [sourceGroup, sourceDay, sourceIndex] = active.id
			.toString()
			.split("-");
		const [targetGroup, targetDay, targetIndex] = over.id.toString().split("-");

		const newSchedule = JSON.parse(JSON.stringify(schedule)) as ScheduleData;

		// Получаем исходные данные
		const sourceLessons = newSchedule.groupTimetables[sourceGroup]?.[sourceDay];
		if (!sourceLessons) return;

		// Удаляем элемент из источника
		const [movedLesson] = sourceLessons.splice(parseInt(sourceIndex), 1);

		// Создаем целевую группу если не существует
		if (!newSchedule.groupTimetables[targetGroup]) {
			newSchedule.groupTimetables[targetGroup] = {};
		}

		// Создаем целевой день если не существует
		if (!newSchedule.groupTimetables[targetGroup][targetDay]) {
			newSchedule.groupTimetables[targetGroup][targetDay] = [];
		}

		const targetLessons = newSchedule.groupTimetables[targetGroup][targetDay];
		const newIndex = targetIndex ? parseInt(targetIndex) : targetLessons.length;

		// Вставляем элемент в цель
		targetLessons.splice(newIndex, 0, movedLesson);

		setSchedule(newSchedule);
		setActiveId(null);
	};

	return (
		<div className='p-6'>
			<h1 className='text-3xl font-bold text-center mb-8'>Расписание</h1>
			{!isPending && schedule && (
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragStart={handleDragStart}
					onDragEnd={handleDragEnd}
				>
					<div className='space-y-8'>
						{Object.entries(schedule.groupTimetables).map(([group, days]) => (
							<div
								key={group}
								className='bg-white shadow-md rounded-lg p-6 space-y-4'
							>
								<h2 className='text-xl font-semibold flex items-center gap-2'>
									<User size={20} className='text-gray-500' /> Группа: {group}
								</h2>

								<div className='flex flex-wrap gap-6'>
									{Object.entries(days).map(([day, lessons]) => (
										<div
											key={day}
											id={`${group}-${day}`}
											className='bg-gray-50 p-4 rounded-md shadow-sm w-72 space-y-2'
										>
											<h3 className='text-lg font-medium flex items-center gap-2'>
												<Calendar size={18} className='text-gray-500' /> {day}
											</h3>
											<SortableContext
												items={lessons.map((_, i) => `${group}-${day}-${i}`)}
												strategy={verticalListSortingStrategy}
											>
												{lessons.length === 0 ? (
													<p className='text-gray-500 flex items-center gap-2'>
														<BookOpen size={16} /> Нет занятий
													</p>
												) : (
													<ul className='space-y-4'>
														{lessons.map((lessonSlot, index) => (
															<SortableItem
																key={`${group}-${day}-${index}`}
																id={`${group}-${day}-${index}`}
															>
																<li className='bg-white p-3 rounded-md shadow-sm space-y-1'>
																	{Array.isArray(lessonSlot) &&
																		lessonSlot.map((lesson, lessonIndex) => (
																			<div
																				key={lessonIndex}
																				className='bg-white shadow-sm rounded-lg p-4 space-y-2'
																			>
																				<div className='flex items-center gap-2'>
																					<BookOpen
																						size={18}
																						className='text-blue-500'
																					/>
																					<span className='text-gray-700 font-medium'>
																						{lesson.subject}
																					</span>
																				</div>
																				<div className='flex items-center gap-2 text-sm text-gray-600'>
																					<MapPin
																						size={16}
																						className='text-green-500'
																					/>
																					<span>Кабинет: {lesson.cabinet}</span>
																				</div>
																				<div className='flex items-center gap-2 text-sm text-gray-600'>
																					<User
																						size={16}
																						className='text-purple-500'
																					/>
																					<span>
																						Преподаватель: {lesson.teacher}
																					</span>
																				</div>
																				<div className='flex items-center gap-2 text-sm text-gray-600'>
																					<Clock
																						size={16}
																						className='text-yellow-500'
																					/>
																					<span>
																						Тип занятия: {lesson.lessonType}
																					</span>
																				</div>
																			</div>
																		))}
																</li>
															</SortableItem>
														))}
													</ul>
												)}
											</SortableContext>
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</DndContext>
			)}
		</div>
	);
};
