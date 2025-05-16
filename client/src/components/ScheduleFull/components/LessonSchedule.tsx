import { DaySchedule } from "@/types/schedule.type";
import { BookOpen, Divide, MapPin, User, Users } from "lucide-react";
import { m } from "motion/react";

type Props = {
	timeSlot: [string, DaySchedule];
};

export const LessonSchedule = ({ timeSlot }: Props) => {
	console.log(timeSlot);

	return (
		<>
			{timeSlot[1].map((lesson: any, lessonIndex) => (
				<m.div
					key={lessonIndex}
					variants={{
						hidden: { opacity: 0, y: 20 },
						visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
					}}
					initial='hidden'
					animate='visible'
					className='bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200'
				>
					{/* Заголовок предмета */}
					<div className='flex items-center gap-2 mb-3'>
						<BookOpen size={20} className='text-gray-600' />
						<h3 className='text-lg font-semibold text-gray-800'>
							{lesson.subject}
						</h3>
					</div>

					{/* Детали занятия */}
					<div className='flex flex-col space-y-2 text-sm text-gray-600'>
						{/* Группа */}
						<div className='flex items-center gap-2'>
							<Users size={16} className='text-gray-500' />
							<span>
								<span className='font-medium'>Группа:</span> {lesson.group}
							</span>
						</div>

						{/* Кабинет */}
						<div className='flex items-center gap-2'>
							<MapPin size={16} className='text-gray-500' />
							<span>
								<span className='font-medium'>Кабинет:</span> {lesson.cabinet}
							</span>
						</div>

						{/* Преподаватель */}
						<div className='flex items-center gap-2'>
							<User size={16} className='text-gray-500' />
							<span>
								<span className='font-medium'>Преподаватель:</span>{" "}
								{lesson.teacher}
							</span>
						</div>

						{/* Тип занятия */}
						<div className='flex items-center gap-2'>
							<Divide size={16} className='text-gray-500' />
							<span>
								<span className='font-medium'>Тип занятия:</span>{" "}
								{lesson.lessonType === "L"
									? "Лекция"
									: lesson.lessonType === "1"
									? "Первая подгруппа"
									: "Вторая подгруппа"}
							</span>
						</div>
					</div>
				</m.div>
			))}
		</>
	);
};
