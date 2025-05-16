import { GroupTimetables } from "@/types/schedule.type";
import { CalendarDays } from "lucide-react";
import { LessonSchedule } from "./components/LessonSchedule";

type Props = {
	groupSchedule: GroupTimetables;
};

export const ScheduleLesson = ({ groupSchedule }: Props) => {
	return (
		<div className='space-y-6'>
			{/* Заголовок */}
			<h2 className='text-2xl font-bold text-indigo-600 flex items-center gap-2'>
				<CalendarDays size={24} /> Расписание занятий
			</h2>

			{/* Сетка для дней недели */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
				{Object.entries(groupSchedule).map(([day, lessons]) => (
					<div
						key={day}
						className='bg-white p-6 rounded-lg shadow-md space-y-4'
					>
						{/* День недели */}
						<h3 className='text-xl font-semibold text-gray-800'>{day}</h3>

						{/* Проверка, есть ли уроки в этот день */}
						{Object.keys(lessons).length === 0 ? (
							<p className='text-sm text-gray-500'>Нет уроков</p>
						) : (
							<div className='space-y-4'>
								{Object.entries(lessons).map(
									([timeSlot, lesson], timeIndex) => (
										<div
											key={timeIndex}
											className='bg-gray-50 p-4 rounded-lg shadow-sm space-y-2'
										>
											{/* Время (Пара 1, Пара 2 и т.д.) */}
											<p className='text-xs font-medium text-gray-700'>
												Пара {timeIndex + 1}
											</p>

											{/* Информация о каждом уроке */}
											<LessonSchedule timeSlot={[timeSlot, lesson]} />
										</div>
									)
								)}
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
};
