"use client";

import { ScheduleDays } from "@/components/ScheduleFull/ScheduleDays";
import { DASHBOARD_PAGES } from "@/config/pages-url.config";
import { useProfile } from "@/hook/useProfile";
import { scheduleIdAtom } from "@/jotai/schedule";
import { scheduleService } from "@/services/schedule.service";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
	id: number;
};

export const ScheduleId = ({ id }: Props) => {
	const [scheduleId, setScheduleId] = useAtom(scheduleIdAtom);

	const { data: profile } = useProfile();
	const { push } = useRouter();

	const { data: schedule_id } = useQuery({
		queryKey: ["schedule_get"],
		queryFn: () => scheduleService.getSchedule(profile!.api_key, String(id)),
		select: data => data.data,
	});

	useEffect(() => {
		if (!schedule_id) {
			push(DASHBOARD_PAGES.SCHEDULE);
		}
		console.log(schedule_id?.schedule);
	}, [schedule_id]);

	return (
		<>
			<div>
				<div>
					{schedule_id?.title} {id}
				</div>
				<div>{schedule_id?.description}</div>
				<div>
					<Link href={`${DASHBOARD_PAGES.SCHEDULE}`}>Вернуться</Link>
				</div>
			</div>
			<div>
				{scheduleId?.map(schedule => (
					<div
						key={schedule.id}
						className='bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg'
					>
						{/* Расписание по дням */}
						<ScheduleDays schedule={schedule_id} />
					</div>
				))}
			</div>
		</>
	);
};
