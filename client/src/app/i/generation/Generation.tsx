"use client";

import { DASHBOARD_PAGES } from "@/config/pages-url.config"
import { useGetAllUsersSchedule } from "@/hook/useGetAllUsersSchedule"
import { useProfile } from "@/hook/useProfile"
import {
	ArrowRightIcon,
	CalendarIcon,
	ClipboardList,
	Search,
} from "lucide-react"
import { m } from "motion/react"
import Link from "next/link"
import { useState } from "react"

export const Generation = () => {
	const { data: profile } = useProfile();
	const { list_schedule, isLoading, isError } = useGetAllUsersSchedule(
		profile!
	);

	const [searchTerm, setSearchTerm] = useState("");

	if (isLoading) return <div>Загрузка...</div>;
	if (isError) return <div>Ошибка</div>;

	// Сначала фильтруем по isShow = true
	const activeSchedules = list_schedule?.filter(s => s.isShow) || [];

	// Затем фильтруем по названию и описанию
	const filteredSchedules = activeSchedules.filter(schedule => {
		const matchesTitle = schedule.title
			.toLowerCase()
			.includes(searchTerm.toLowerCase());
		const matchesDescription = schedule.description
			.toLowerCase()
			.includes(searchTerm.toLowerCase());

		return matchesTitle || matchesDescription;
	});

	return (
		<div className='space-y-6'>
			{/* Поле поиска */}
			<div className='relative max-w-md mx-auto sm:mx-0'>
				<Search className='absolute left-3 top-3.5 h-5 w-5 text-gray-400' />
				<input
					type='text'
					placeholder='Поиск по названию или описанию...'
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
					className='pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand bg-white'
				/>
			</div>

			{/* Список расписаний */}
			{filteredSchedules.length > 0 ? (
				<div className='space-y-4'>
					{filteredSchedules.map(schedule => (
						<m.div
							key={schedule.id}
							initial={{ opacity: 0, y: 5 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.2 }}
							className='bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-200 p-4 mb-4 transition-shadow'
						>
							<div className='flex justify-between items-start mb-4'>
								<div className='flex items-center gap-3'>
									<ClipboardList className='w-6 h-6 text-gray-500' />
									<h2 className='text-xl font-bold text-gray-950'>
										{schedule.title}
									</h2>
								</div>
								<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-950'>
									ID: {schedule.id}
								</span>
							</div>

							<p className='text-gray-600 mb-3 line-clamp-2'>
								{schedule.description || "Нет описания"}
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
						</m.div>
					))}
				</div>
			) : (
				<div className='text-center py-8 text-gray-500'>
					{searchTerm
						? "Расписание не найдено"
						: "Активных расписаний пока нет"}
				</div>
			)}
		</div>
	);
};
