"use client";
import { DASHBOARD_PAGES } from "@/config/pages-url.config";
import { useGetAllUsersSchedule } from "@/hook/useGetAllUsersSchedule";
import { useProfile } from "@/hook/useProfile";
import { ArrowRightIcon, CalendarIcon } from "lucide-react";
import Link from "next/link";

export const Schedule = () => {
	const { data: profile } = useProfile();

	const { list_schedule, isLoading, isError } = useGetAllUsersSchedule(
		profile!
	);

	return (
		<div>
			{!isLoading && !isError ? (
				<>
					{list_schedule?.map(schedule => (
						<div
							key={schedule.id}
							className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow'
						>
							<div className='p-5'>
								<div className='flex justify-between items-start mb-3'>
									<h3 className='text-lg font-semibold text-gray-800'>
										{schedule.title}
									</h3>
									<span
										className={`px-2 py-1 text-xs rounded-full ${
											schedule.isShow
												? "bg-green-100 text-green-800"
												: "bg-gray-100 text-gray-800"
										}`}
									>
										{schedule.isShow ? "Активна" : "Скрыто"}
									</span>
								</div>

								<p className='text-gray-600 mb-4 line-clamp-2'>
									{schedule.description}
								</p>

								<div className='grid grid-cols-2 gap-3 mb-4 text-sm'>
									<div className='flex items-center text-gray-500'>
										<CalendarIcon className='w-4 h-4 mr-2' />
										<span>
											Создано:{" "}
											{new Date(schedule.CreatedAt).toLocaleDateString()}
										</span>
									</div>
									<div className='flex items-center text-gray-500'>
										<span>
											Обновленно:{" "}
											{new Date(schedule.UpdatedAt).toLocaleDateString()}
										</span>
									</div>
									<div className='flex items-center'>
										<span className='font-medium'>
											{schedule.schedule_count} генераций
										</span>
									</div>
									<div className='flex items-center text-gray-500'>
										<span>ID: {schedule.id}</span>
									</div>
								</div>

								<Link
									href={`${DASHBOARD_PAGES.SCHEDULE_ID}${schedule.id}`}
									className='w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-950 '
								>
									Перейти
									<ArrowRightIcon className='w-4 h-4 ml-2' />
								</Link>
							</div>
						</div>
					))}
				</>
			) : (
				isError && <>Ошибка</>
			)}
		</div>
	);
};
