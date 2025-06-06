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
import { useAtom } from "jotai";
import { Trash } from "lucide-react";
import { useEffect } from "react";

export const AllSchedule = () => {
	const { data: profile } = useProfile();
	const [currentSchedule, setCurrentSchedule] = useAtom<ISchedule | null>(
		currentScheduleAtom
	);
	const [scheduleListState, setScheduleListState] = useAtom<ISchedule[] | null>(
		scheduleListAtom
	);

	// Вывод всех расписаний
	const { data: scheduleList, isPending } = useQuery({
		queryKey: ["schedule all"],
		queryFn: () => scheduleService.getAllSchedule(profile!.api_key),
		select: data => data.data,
	});

	const handlerCurrentSchedule = (schedule: ISchedule) => {
		if (schedule) {
			console.log(schedule);
			setCurrentSchedule(schedule);
		} else {
			console.log("Ошибка");
		}
	};

	useEffect(() => {
		if (scheduleList) {
			setScheduleListState(scheduleList);
		}
	}, [scheduleList]);

	return (
		<>
			{!isPending && scheduleListState && (
				<div className='space-y-6 flex flex-wrap items-center'>
					{scheduleListState.map((schedule: ISchedule, index: number) => (
						<div
							key={schedule.id}
							className='bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg w-1/3'
							onClick={() => handlerCurrentSchedule(schedule)}
						>
							<div className='p-6'>
								{/* Название и id */}
								<ScheduleId index={index} id={schedule.id} />

								<div className='mt-4 grid grid-cols-1 md:grid-cols-3 gap-4'>
									{/* Группы */}
									<ScheduleGroups groups={schedule.groups} />

									{/* Кабинеты */}
									<ScheduleCabinets cabinets={schedule.cabinets} />

									{/* Преподаватели */}
									<ScheduleTeachers teachers={schedule.teachers} />
								</div>

								<ScheduleData
									CreatedAt={schedule.CreatedAt}
									UpdatedAt={schedule.UpdatedAt}
								/>
							</div>
							<div className='flex justify-end pr-10 pb-10'>
								<ButtonIcon icon={Trash} />
							</div>
						</div>
					))}
				</div>
			)}
		</>
	);
};
