"use client";
import { useProfile } from "@/hook/useProfile";
import { scheduleService } from "@/services/schedule.service";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { GroupUser } from "./components/GroupUser";
import { Lessons } from "./components/Lessons";

interface ScheduleData {
	[group: string]: {
		[day: string]: Array<Array<any>>;
	};
}

export const Schedule = () => {
	const { data: profileData } = useProfile();
	const [schedule, setSchedule] = useState<ScheduleData | null>(null);
	const [failedSchedule, setFailedSchedule] = useState<any>(null);

	const {
		data: scheduleData,
		isPending,
		isError,
	} = useQuery({
		queryKey: ["querySchedule"],
		queryFn: () => scheduleService.getSchedule(profileData!.api_key),
		select: data => data.data,
		enabled: !!profileData?.api_key,
	});

	useEffect(() => {
		if (scheduleData) {
			setSchedule(scheduleData.schedule.groupTimetables as any);
			setFailedSchedule(scheduleData.schedule.failedAllocations);
		}
	}, [scheduleData]);

	return (
		<div className='p-6 min-h-screen bg-gray-100'>
			<h1 className='text-3xl font-bold text-center mb-8 text-gray-800'>
				Расписание
			</h1>

			{!isPending && schedule && (
				<div className='space-y-8'>
					{Object.entries(schedule).map(([group, days]) => (
						<div
							key={group}
							className='bg-white shadow-md rounded-lg p-6 space-y-4'
						>
							<GroupUser group={group} />

							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
								{Object.entries(days).map(([day, lessons]) => (
									<Lessons
										key={`${lessons}-${day}`}
										lessons={lessons}
										day={day}
										group={group}
									/>
								))}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
