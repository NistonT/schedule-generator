"use client";
import { ScheduleFull } from "@/components/ScheduleFull";
import { useProfile } from "@/hook/useProfile";
import { scheduleIdAtom } from "@/jotai/schedule";
import { scheduleService } from "@/services/schedule.service";
import { IScheduleGetList } from "@/types/schedule.types";
import { useQuery } from "@tanstack/react-query";
import { motion as m } from "framer-motion";
import { useSetAtom } from "jotai";
import { CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";

export const Schedule = () => {
	const { data: profile } = useProfile();
	const [schedules, setSchedule] = useState<IScheduleGetList[] | null>(null);
	const [searchQuery, setSearchQuery] = useState<string>(""); // Состояние для поискового запроса

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

				{/* Поле поиска */}
				<div className='mb-8 w-full max-w-md mx-auto'>
					<input
						type='text'
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
						placeholder='Поиск по названию расписания...'
						className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-gray-400'
					/>
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
					) : filteredSchedules && filteredSchedules.length > 0 ? (
						<ScheduleFull schedules={filteredSchedules} isShow={false} />
					) : (
						<p className='text-center text-gray-600'>Расписания не найдены</p>
					)}
				</m.div>
			</div>
		</>
	);
};
