"use client";
import { ScheduleFull } from "@/components/ScheduleFull";
import { useProfile } from "@/hook/useProfile";
import { scheduleIdAtom } from "@/jotai/schedule";
import { scheduleService } from "@/services/schedule.service";
import { IScheduleGetList } from "@/types/schedule.type";
import { useQuery } from "@tanstack/react-query";
import { motion as m } from "framer-motion";
import { useSetAtom } from "jotai";
import { ArrowDown, ArrowUp, CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";

export const Schedule = () => {
	const { data: profile } = useProfile();
	const [schedules, setSchedule] = useState<IScheduleGetList[] | null>(null);
	const [searchQuery, setSearchQuery] = useState<string>(""); // Состояние для поискового запроса
	const [sortByNewest, setSortByNewest] = useState<boolean>(true); // Состояние для сортировки (true = новые, false = старые)

	const setScheduleId = useSetAtom(scheduleIdAtom);

	const { data: scheduleList, isPending } = useQuery({
		queryKey: ["schedule all"],
		queryFn: () => scheduleService.getAllSchedule(profile!.api_key),
		select: data => data.data,
	});

	useEffect(() => {
		if (scheduleList) {
			setSchedule(scheduleList);
			setScheduleId(scheduleList);
		}
	}, [scheduleList]);

	// Фильтрация расписаний по поисковому запросу
	const filteredSchedules = schedules?.filter(schedule =>
		schedule.title?.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Сортировка расписаний по новизне/старизне
	const sortedSchedules = filteredSchedules?.sort((a, b) => {
		const dateA = new Date(a.CreatedAt).getTime();
		const dateB = new Date(b.CreatedAt).getTime();

		return sortByNewest ? dateB - dateA : dateA - dateB;
	});

	return (
		<>
			<div className='p-6 min-h-screen bg-gray-100'>
				{/* Заголовок */}
				<m.div
					variants={{
						hidden: { opacity: 0, y: 20 },
						visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
					}}
					initial='hidden'
					animate='visible'
					className='flex flex-col items-center mb-8 space-y-4'
				>
					<CalendarDays size={40} className='text-indigo-600' />
					<h1 className='text-3xl font-bold text-center text-gray-800'>
						Расписание
					</h1>
				</m.div>

				{/* Панель управления: поиск и сортировка */}
				<div className='mb-8 w-full max-w-md mx-auto flex flex-col md:flex-row items-center gap-4'>
					{/* Поле поиска */}
					<input
						type='text'
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
						placeholder='Поиск по названию расписания...'
						className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-gray-400'
					/>

					{/* Кнопка переключения сортировки */}
					<button
						onClick={() => setSortByNewest(prev => !prev)}
						className='px-4 py-2 text-sm font-medium rounded bg-gray-200 hover:bg-gray-300 transition-colors flex items-center gap-1'
					>
						{sortByNewest ? (
							<>
								<ArrowDown size={16} /> От новых к старым
							</>
						) : (
							<>
								<ArrowUp size={16} /> От старых к новым
							</>
						)}
					</button>
				</div>

				{/* Контент расписания */}
				<m.div
					variants={{
						hidden: { opacity: 0, y: 20 },
						visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
					}}
					initial='hidden'
					animate='visible'
					className='space-y-8'
				>
					{isPending ? (
						<p className='text-center text-gray-600'>Загрузка...</p>
					) : sortedSchedules && sortedSchedules.length > 0 ? (
						<ScheduleFull schedules={sortedSchedules} isShow={false} />
					) : (
						<p className='text-center text-gray-600'>Расписания не найдены</p>
					)}
				</m.div>
			</div>
		</>
	);
};
