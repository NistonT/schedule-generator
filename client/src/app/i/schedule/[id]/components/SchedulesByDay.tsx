import { IGroupedDays } from "@/types/schedule.type";

type Props = {
	groupedDays: IGroupedDays[];
};

export const SchedulesByDays = ({ groupedDays }: Props) => {
	return (
		<>
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
	);
};
