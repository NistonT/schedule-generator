"use client";
import { useProfile } from "@/hook/useProfile";
import { scheduleService } from "@/services/schedule.service";
import { useQuery } from "@tanstack/react-query";

export interface ILesson {
	id: number;
	date: string;
	group: string;
	lesson: number;
	cabinet: string;
	subject: string;
	teacher: string;
	lessonType: string;
}

type Props = {
	id: string;
};

export const ScheduleId = ({ id: scheduleId }: Props) => {
	const { data: profile } = useProfile();

	const {
		data: schedule,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["get_scheduleId"],
		queryFn: () => scheduleService.getSchedule(profile!.api_key, scheduleId),
		select: data => data.data,
	});

	if (!schedule || !schedule.schedule?.schedule) return null;

	// Общая статистика
	const totalDays = schedule.schedule.schedule.length;
	const totalLessons = schedule.schedule.schedule.reduce(
		(acc, day) => acc + day.length,
		0
	);

	// Группируем все уроки по дате, чтобы объединить одинаковые дни
	const lessonsByDate = new Map<string, ILesson[]>();

	schedule.schedule.schedule.forEach(dayLessons => {
		dayLessons.forEach(lesson => {
			const date = lesson.date;
			if (!lessonsByDate.has(date)) {
				lessonsByDate.set(date, []);
			}
			lessonsByDate.get(date)?.push(lesson);
		});
	});

	const groupedDays = Array.from(lessonsByDate.entries()).map(
		([date, lessons]) => ({
			date,
			lessons,
		})
	);

	// Подсчёт предметов, групп и кабинетов
	const subjectCountMap = new Map<string, number>();
	const groupSet = new Set<string>();
	const cabinetSet = new Set<string>();

	schedule.schedule.schedule.flat().forEach(lesson => {
		if (lesson.subject) {
			subjectCountMap.set(
				lesson.subject,
				(subjectCountMap.get(lesson.subject) || 0) + 1
			);
		}
		if (lesson.group) {
			groupSet.add(lesson.group);
		}
		if (lesson.cabinet) {
			cabinetSet.add(lesson.cabinet);
		}
	});

	const subjectCountList = Array.from(subjectCountMap.entries()).sort(
		(a, b) => b[1] - a[1]
	);
	const uniqueSubjects = Array.from(
		new Set(
			schedule.schedule.schedule
				.flat()
				.map(l => l.subject)
				.filter(Boolean)
		)
	);
	const uniqueGroups = Array.from(groupSet);
	const uniqueCabinets = Array.from(cabinetSet);

	// Группировка по группам для отображения предметов на группу
	const lessonsByGroup = new Map<string, Map<string, number>>();

	schedule.schedule.schedule.flat().forEach(lesson => {
		if (!lesson.group || !lesson.subject) return;

		const group = lesson.group;
		const subject = lesson.subject;

		if (!lessonsByGroup.has(group)) {
			lessonsByGroup.set(group, new Map<string, number>());
		}

		const groupMap = lessonsByGroup.get(group)!;
		groupMap.set(subject, (groupMap.get(subject) || 0) + 1);
	});

	return (
		<div className='p-4'>
			{!isLoading && !isError ? (
				<>
					<h1 className='text-2xl font-bold mb-4'>{schedule.title}</h1>
					<p>{schedule.description}</p>

					{/* Статистика */}
					<div className='my-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5'>
						<div className='border p-3 rounded-md'>
							<strong>Дата создания:</strong>{" "}
							{new Date(schedule.CreatedAt).toLocaleDateString()}
						</div>
						<div className='border p-3 rounded-md'>
							<strong>Дата обновления:</strong>{" "}
							{new Date(schedule.UpdatedAt).toLocaleDateString()}
						</div>
						<div className='border p-3 rounded-md'>
							<strong>ID:</strong> {schedule.id}
						</div>
						<div className='border p-3 rounded-md'>
							<strong>Статус:</strong>{" "}
							{schedule.isShow ? "Отображается" : "Скрыто"}
						</div>
						<div className='border p-3 rounded-md'>
							<strong>Всего пар:</strong> {totalLessons}
						</div>
						<div className='border p-3 rounded-md'>
							<strong>Всего дней:</strong> {groupedDays.length}
						</div>
						<div className='border p-3 rounded-md'>
							<strong>Предметов:</strong> {uniqueSubjects.length}
						</div>
						<div className='border p-3 rounded-md'>
							<strong>Групп:</strong> {uniqueGroups.length}
						</div>
						<div className='border p-3 rounded-md'>
							<strong>Кабинетов:</strong> {uniqueCabinets.length}
						</div>
					</div>

					{/* Таблица предметов и количество уроков */}
					<h2 className='text-xl font-semibold mt-8 mb-4'>
						Предметы в расписании
					</h2>
					<div className='overflow-x-auto'>
						<table className='min-w-full bg-white border border-gray-300'>
							<thead className='bg-gray-100'>
								<tr>
									<th className='py-2 px-4 border-r'>Предмет</th>
									<th className='py-2 px-4'>Количество пар</th>
								</tr>
							</thead>
							<tbody>
								{subjectCountList.map(([subject, count]) => (
									<tr key={subject} className='hover:bg-gray-50'>
										<td className='py-2 px-4 border-r border-b'>{subject}</td>
										<td className='py-2 px-4 text-center border-b'>{count}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* Предметы по группам */}
					<h2 className='text-xl font-semibold mt-12 mb-4'>
						Предметы по группам
					</h2>
					<div className='space-y-6'>
						{Array.from(lessonsByGroup.entries()).map(([group, subjects]) => (
							<div
								key={group}
								className='border p-4 rounded-md bg-white shadow-sm'
							>
								<h3 className='text-lg font-medium mb-3'>Группа: {group}</h3>
								<ul className='space-y-2'>
									{Array.from(subjects.entries())
										.sort((a, b) => b[1] - a[1])
										.map(([subject, count]) => (
											<li
												key={subject}
												className='flex justify-between border-b pb-1'
											>
												<span>{subject}</span>
												<span className='font-medium text-gray-700'>
													{count} пар
												</span>
											</li>
										))}
								</ul>
							</div>
						))}
					</div>

					{/* Расписание по дням */}
					<h2 className='text-xl font-semibold mt-12 mb-4'>Расписание</h2>
					<div>
						{groupedDays.map((day, dayIndex) => {
							const { date, lessons } = day;
							return (
								<div key={dayIndex} className='mb-8 border p-4 rounded-lg'>
									<h3 className='text-lg font-medium mb-4'>
										📅 {new Date(date).toLocaleDateString("ru-RU")} (
										{new Date(date).toLocaleDateString("ru-RU", {
											weekday: "long",
										})}
										)
									</h3>

									<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
										{Array.from({ length: 6 }).map((_, lessonNumber) => {
											const lesson = lessons.find(
												l => l.lesson === lessonNumber + 1
											);
											return (
												<div
													key={`lesson-${lessonNumber + 1}`}
													className={`p-4 border rounded-md min-h-[100px] ${
														lesson
															? "bg-white shadow-sm"
															: "bg-gray-50 italic text-gray-400"
													}`}
												>
													{lesson ? (
														<>
															<strong>Урок {lesson.lesson}</strong>
															<div>Каб. {lesson.cabinet}</div>
															<div>{lesson.subject}</div>
															<div className='text-sm text-gray-600'>
																{lesson.group}, {lesson.lessonType}
															</div>
														</>
													) : (
														`Пара ${lessonNumber + 1}: свободно`
													)}
												</div>
											);
										})}
									</div>
								</div>
							);
						})}
					</div>
				</>
			) : isError ? (
				<div>Ошибка загрузки расписания</div>
			) : (
				<div>Загрузка...</div>
			)}
		</div>
	);
};
