import { ISchedule } from "@/types/schedule.types";
import { LessonSchedule } from "./components/LessonSchedule";

type Props = {
	schedule: ISchedule | null | undefined;
};

export const ScheduleDays = ({ schedule }: Props) => {
	return (
		<>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{schedule?.schedule?.groupTimetables &&
				Object.entries(schedule.schedule.groupTimetables).length > 0
					? Object.entries(schedule.schedule.groupTimetables).map(
							([group, groupSchedule]) => (
								<div
									key={group}
									className='bg-white shadow-md rounded-lg p-6 space-y-4'
								>
									{/* Название группы */}
									<h4 className='text-xl font-bold text-gray-800'>{group}</h4>

									{/* Проверка, есть ли дни недели в расписании */}
									{Object.keys(groupSchedule).length === 0 ? (
										<p className='text-sm text-gray-500'>
											Расписание отсутствует
										</p>
									) : (
										<>
											{Object.entries(groupSchedule).map(([day, lessons]) => {
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
																			<LessonSchedule timeSlot={timeSlot} />
																		</div>
																	)
																)}
															</div>
														)}
													</div>
												);
											})}
										</>
									)}
								</div>
							)
					  )
					: ""}
			</div>
		</>
	);
};
