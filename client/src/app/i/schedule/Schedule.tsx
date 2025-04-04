"use client";
import { useProfile } from "@/hook/useProfile";
import { scheduleService } from "@/services/schedule.service";
import { IScheduleGetList } from "@/types/schedule.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const Schedule = () => {
	const { data: profile } = useProfile();
	const [schedules, setSchedule] = useState<IScheduleGetList[] | null>(null);

	const { data: scheduleList, isPending } = useQuery({
		queryKey: ["schedule all"],
		queryFn: () => scheduleService.getAllSchedule(profile!.api_key),
		select: data => data.data,
	});

	useEffect(() => {
		if (scheduleList) {
			setSchedule(scheduleList);
		}
	}, [scheduleList]);

	return (
		<div className='p-6 min-h-screen bg-gray-100'>
			<h1 className='text-3xl font-bold text-center mb-8 text-gray-800'>
				Расписание
			</h1>

			{!isPending && schedules && (
				<div className='space-y-8'>
					{schedules.map(schedule => (
						<div
							key={schedule.id}
							className='bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg'
						>
							{/* Заголовок расписания */}
							<div className='p-6 border-b border-gray-200'>
								<h2 className='text-xl font-bold text-gray-800'>
									ID: {schedule.id}
								</h2>
								<div className='flex flex-wrap gap-4 mt-4'>
									{/* Группы */}
									<div className='flex items-center gap-2'>
										<span className='text-sm font-medium text-gray-500'>
											Группы:
										</span>
										<div className='flex flex-wrap gap-2'>
											{schedule.groups.map((group, idx) => (
												<span
													key={idx}
													className='px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium'
												>
													{group}
												</span>
											))}
										</div>
									</div>

									{/* Преподаватели */}
									<div className='flex items-center gap-2'>
										<span className='text-sm font-medium text-gray-500'>
											Преподаватели:
										</span>
										<div className='flex flex-wrap gap-2'>
											{schedule.teachers.map(teacher => (
												<span
													key={teacher.tid}
													className='px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium'
												>
													{teacher.name}
												</span>
											))}
										</div>
									</div>

									{/* Кабинеты */}
									<div className='flex items-center gap-2'>
										<span className='text-sm font-medium text-gray-500'>
											Кабинеты:
										</span>
										<div className='flex flex-wrap gap-2'>
											{schedule.cabinets.map((cabinet, idx) => (
												<span
													key={idx}
													className='px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium'
												>
													{cabinet}
												</span>
											))}
										</div>
									</div>
								</div>
							</div>

							{/* Расписание по дням */}
							<div className='p-6'>
								<h3 className='text-lg font-semibold text-gray-700 mb-4'>
									Расписание по дням
								</h3>
								<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
									{Object.entries(schedule.schedule.groupTimetables).map(
										([group, groupSchedule]) => (
											<div
												key={group}
												className='bg-white shadow-md rounded-lg p-6 space-y-4'
											>
												{/* Название группы */}
												<h4 className='text-xl font-bold text-gray-800'>
													{group}
												</h4>

												{/* Проверка, есть ли дни недели в расписании */}
												{Object.keys(groupSchedule).length === 0 ? (
													<p className='text-sm text-gray-500'>
														Расписание отсутствует
													</p>
												) : (
													<>
														{Object.entries(groupSchedule).map(
															([day, lessons]) => {
																// TypeScript уже знает, что lessons имеет тип DaySchedule
																return (
																	<div key={day} className='space-y-2'>
																		{/* День недели */}
																		<h5 className='text-md font-medium text-gray-700'>
																			{day}
																		</h5>

																		{/* Проверка, есть ли уроки в этот день */}
																		{Object.keys(lessons).length === 0 ? (
																			<p className='text-sm text-gray-500'>
																				Нет уроков
																			</p>
																		) : (
																			<div className='space-y-2'>
																				{Object.entries(lessons).map(
																					(timeSlot, timeIndex) => (
																						<div
																							key={timeIndex}
																							className='bg-gray-50 p-3 rounded-md shadow-sm space-y-1'
																						>
																							{/* Время (Пара 1, Пара 2 и т.д.) */}
																							<p className='text-xs font-medium text-gray-500'>
																								Пара {timeIndex + 1}
																							</p>

																							{/* Информация о каждом уроке */}
																							{timeSlot.map(
																								(lesson, lessonIndex) => {
																									// Проверяем, является ли lesson объектом типа Lesson
																									console.log(lesson);

																									return (
																										<div
																											key={lessonIndex}
																											className='flex flex-col text-sm text-gray-700'
																										>
																											{Object.entries(
																												lesson
																											).map(les => (
																												<div>
																													{les.map(elem => (
																														<div>
																															<span>
																																<strong>
																																	{elem.subject}
																																</strong>{" "}
																																(
																																{
																																	elem.lessonType
																																}
																																)
																															</span>
																															<span>
																																Кабинет:{" "}
																																{elem.cabinet}
																															</span>
																															<span>
																																Преподаватель:{" "}
																																{elem.teacher}
																															</span>
																														</div>
																													))}
																												</div>
																											))}
																										</div>
																									);
																								}
																							)}
																						</div>
																					)
																				)}
																			</div>
																		)}
																	</div>
																);
															}
														)}
													</>
												)}
											</div>
										)
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
