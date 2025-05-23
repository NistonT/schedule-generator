"use client";

import { DASHBOARD_PAGES } from "@/config/pages-url.config";
import { useGetAllUsersSchedule } from "@/hook/useGetAllUsersSchedule";
import { useProfile } from "@/hook/useProfile";
import { ArrowRightIcon, CalendarIcon } from "lucide-react";
import Link from "next/link";

export const Generation = () => {
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
							className='bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-4 mb-4'
						>
							<div className='flex justify-between items-start mb-2'>
								<h3 className='text-lg font-semibold text-gray-800'>
									{schedule.title}
								</h3>
								<span className='text-xs text-gray-500'>ID: {schedule.id}</span>
							</div>

							<p className='text-gray-600 mb-3 line-clamp-2'>
								{schedule.description}
							</p>

							<div className='flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500 mb-3'>
								<div className='flex items-center'>
									<CalendarIcon className='w-4 h-4 mr-1' />
									<span>
										Создано: {new Date(schedule.CreatedAt).toLocaleDateString()}
									</span>
								</div>
								<div className='flex items-center'>
									<span>
										Обновлено:{" "}
										{new Date(schedule.UpdatedAt).toLocaleDateString()}
									</span>
								</div>
							</div>

							<Link
								href={`${DASHBOARD_PAGES.GENERATION_ID}${schedule.id}`}
								className='inline-flex items-center px-4 py-2 bg-blue-50 text-gray-950 rounded-md hover:bg-blue-100 transition-colors text-sm font-medium'
							>
								Перейти
								<ArrowRightIcon className='w-4 h-4 ml-2' />
							</Link>
						</div>
					))}
				</>
			) : (
				isError && <>Ошибка</>
			)}
		</div>
	);
};
