import { DaySchedule } from "@/types/schedule.types";

type Props = {
	timeSlot: [string, DaySchedule];
};

export const LessonSchedule = ({ timeSlot }: Props) => {
	console.log(timeSlot);

	return (
		<>
			{timeSlot[1].map((lesson: any, lessonIndex) => {
				return (
					<div
						key={lessonIndex}
						className='bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200'
					>
						<div className='flex flex-col space-y-2'>
							<div className='text-lg font-semibold text-gray-800'>
								{lesson.subject}
							</div>
							<div className='text-sm text-gray-600'>
								<span className='font-medium'>Группа:</span> {lesson.group}
							</div>
							<div className='text-sm text-gray-600'>
								<span className='font-medium'>Кабинет:</span> {lesson.cabinet}
							</div>
							<div className='text-sm text-gray-600'>
								<span className='font-medium'>Преподаватель:</span>{" "}
								{lesson.teacher}
							</div>
							<div className='text-sm text-gray-600'>
								<span className='font-medium'>Тип занятия:</span>{" "}
								{lesson.lessonType === "L"
									? "Лекция"
									: lesson.lessonType === "1"
									? "Первая подгруппа"
									: "Вторая подгруппа"}
							</div>
						</div>
					</div>
				);
			})}
		</>
	);
};
