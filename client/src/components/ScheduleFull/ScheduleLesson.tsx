import { GroupTimetables } from "@/types/schedule.types";
import { LessonSchedule } from "./components/LessonSchedule";

type Props = {
	groupSchedule: GroupTimetables;
};

export const ScheduleLesson = ({ groupSchedule }: Props) => {
	return (
		<div className='space-y-6'>
			{Object.entries(groupSchedule).map(([day, lessons]) => (
				<div key={day} className='space-y-2'>
					{/* День недели */}
					<h5 className='text-lg font-semibold text-gray-800'>{day}</h5>

					{/* Проверка, есть ли уроки в этот день */}
					{Object.keys(lessons).length === 0 ? (
						<p className='text-sm text-gray-500'>Нет уроков</p>
					) : (
						<div className='space-y-4'>
							{Object.entries(lessons).map(([timeSlot, lesson], timeIndex) => (
								<div
									key={timeIndex}
									className='bg-white p-4 rounded-lg shadow-md border border-gray-100 space-y-2'
								>
									{/* Время (Пара 1, Пара 2 и т.д.) */}
									<p className='text-xs font-medium text-gray-500'>
										Пара {timeIndex + 1}
									</p>

									{/* Информация о каждом уроке */}
									<LessonSchedule timeSlot={[timeSlot, lesson]} />
								</div>
							))}
						</div>
					)}
				</div>
			))}
		</div>
	);
};
