"use client";

import { ScheduleCabinets } from "@/components/AllSchedule/ScheduleCabinets";
import { ScheduleData } from "@/components/AllSchedule/ScheduleData";
import { ScheduleGroups } from "@/components/AllSchedule/ScheduleGroups";
import { ScheduleId } from "@/components/AllSchedule/ScheduleId";
import { ScheduleTeachers } from "@/components/AllSchedule/ScheduleTeachers";
import { ButtonIcon } from "@/components/ui/buttons/ButtonIcon";
import { useProfile } from "@/hook/useProfile";
import { currentScheduleAtom, scheduleListAtom } from "@/jotai/schedule";
import { scheduleService } from "@/services/schedule.service";
import { ISchedule } from "@/types/schedule.type";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { Search, Trash } from "lucide-react";
import { useEffect, useState } from "react";

export const AllSchedule = () => {
	const { data: profile } = useProfile();
	const [currentSchedule, setCurrentSchedule] = useAtom<ISchedule | null>(
		currentScheduleAtom
	);
	const [scheduleListState, setScheduleListState] = useAtom<ISchedule[] | null>(
		scheduleListAtom
	);

	// Поиск
	const [searchTerm, setSearchTerm] = useState("");

	// Запрос на получение всех расписаний
	const {
		data: scheduleList,
		isPending,
		isError,
	} = useQuery({
		queryKey: ["schedule all", profile?.api_key],
		queryFn: () => scheduleService.getAllSchedule(profile!.api_key),
		select: data => data.data,
		enabled: !!profile?.api_key,
	});

	const handlerCurrentSchedule = (schedule: ISchedule) => {
		if (schedule) {
			console.log(schedule);
			setCurrentSchedule(schedule);
		}
	};

	useEffect(() => {
		if (scheduleList) {
			setScheduleListState(scheduleList);
		}
	}, [scheduleList]);

	// Фильтруем только активные и подходящие под поисковый запрос
	const activeSchedules = scheduleListState?.filter(s => s.isShow) || [];
	const filteredSchedules = activeSchedules.filter(schedule => {
		const titleMatch = schedule.title
			.toLowerCase()
			.includes(searchTerm.toLowerCase());
		const descriptionMatch = schedule.description
			.toLowerCase()
			.includes(searchTerm.toLowerCase());

		return titleMatch || descriptionMatch;
	});

	if (isError) {
		return <div>Ошибка при загрузке расписаний</div>;
	}

	return (
		<>
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
			{!isPending && scheduleListState && (
				<>
					{filteredSchedules.length > 0 ? (
						<div className='space-y-6 flex flex-wrap items-center gap-6 justify-center md:justify-start'>
							{filteredSchedules.map((schedule, index) => (
								<motion.div
									key={schedule.id}
									initial={{ opacity: 0, y: 5 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 5 }}
									transition={{ duration: 0.2 }}
									className='bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all w-full sm:w-1/2 md:w-1/3'
									onClick={() => handlerCurrentSchedule(schedule)}
								>
									<div className='p-6'>
										{/* ID и название */}
										<ScheduleId index={index} id={schedule.id} />

										<h2 className='text-xl font-bold text-gray-900 mt-2'>
											{schedule.title}
										</h2>

										{/* Группы, кабинеты, преподаватели */}
										<div className='mt-4 grid grid-cols-1 md:grid-cols-3 gap-4'>
											<ScheduleGroups groups={schedule.groups} />
											<ScheduleCabinets cabinets={schedule.cabinets} />
											<ScheduleTeachers teachers={schedule.teachers} />
										</div>

										{/* Даты */}
										<ScheduleData
											CreatedAt={schedule.CreatedAt}
											UpdatedAt={schedule.UpdatedAt}
										/>
									</div>
									<div className='flex justify-end pr-10 pb-10'>
										<ButtonIcon icon={Trash} />
									</div>
								</motion.div>
							))}
						</div>
					) : (
						<div className='text-center py-8 text-gray-500 text-sm'>
							{searchTerm
								? "Расписание не найдено"
								: "Активных расписаний пока нет"}
						</div>
					)}
				</>
			)}

			{isPending && (
				<div className='text-center py-8 text-gray-500'>Загрузка...</div>
			)}
		</>
	);
};
