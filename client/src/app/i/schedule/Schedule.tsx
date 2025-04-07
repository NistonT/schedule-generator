"use client";
import { ScheduleFull } from "@/components/ScheduleFull";
import { useProfile } from "@/hook/useProfile";
import { scheduleIdAtom } from "@/jotai/schedule";
import { scheduleService } from "@/services/schedule.service";
import { IScheduleGetList } from "@/types/schedule.types";
import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";

export const Schedule = () => {
	const { data: profile } = useProfile();
	const [schedules, setSchedule] = useState<IScheduleGetList[] | null>(null);

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

	return (
		<div className='p-6 min-h-screen bg-gray-100'>
			<h1 className='text-3xl font-bold text-center mb-8 text-gray-800'>
				Расписание
			</h1>

			<ScheduleFull schedules={schedules} isShow={false} />
		</div>
	);
};
