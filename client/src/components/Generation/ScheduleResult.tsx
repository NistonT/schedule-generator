import { useProfile } from "@/hook/useProfile";
import { scheduleService } from "@/services/schedule.service";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

// Определяем типы
export type TypeGetSchedule = {
	cabinet: string;
	group: string;
	lessonType: string;
	subject: string;
	teacher: string;
};

type DaySchedule = TypeGetSchedule[][];

interface Timetable {
	[key: string]: DaySchedule;
}

interface Schedule {
	timetable: Timetable;
}

export const ScheduleResult = () => {
	const { data: profile } = useProfile();

	const {
		data: scheduleResponse,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["get_schedule", profile!.id],
		queryFn: () => scheduleService.getSchedule(profile!.api_key),
		enabled: !!profile,
		select: data => data.data.schedule as Schedule, // Указываем тип Schedule
	});

	useEffect(() => {
		console.log(scheduleResponse);
	}, [scheduleResponse]);

	if (isLoading) return <div>Загрузка...</div>;
	if (isError) return <div>Ошибка при загрузке расписания</div>;

	return (
		<div>
			<h2 className='text-xl font-bold mb-4'>Расписание</h2>
			{scheduleResponse && (
				<div>
					{Object.entries(scheduleResponse.timetable).map(([day, lessons]) => (
						<div key={day} className='mb-6 flex gap-2'>
							<h2>{day} день</h2>
							{lessons.map((lessonGroup: TypeGetSchedule[], index: number) => (
								<div>
									<div key={index} className='mb-4'>
										{lessonGroup.map((lesson: TypeGetSchedule, idx: number) => (
											<div key={idx} className='p-2 border rounded mb-2'>
												<p>
													<strong>Группа:</strong> {lesson.group}
												</p>
												<p>
													<strong>Кабинет:</strong> {lesson.cabinet}
												</p>
												<p>
													<strong>Предмет:</strong> {lesson.subject}
												</p>
												<p>
													<strong>Преподаватель:</strong> {lesson.teacher}
												</p>
												<p>
													<strong>Тип занятия:</strong> {lesson.lessonType}
												</p>
											</div>
										))}
									</div>
								</div>
							))}
						</div>
					))}
				</div>
			)}
		</div>
	);
};
