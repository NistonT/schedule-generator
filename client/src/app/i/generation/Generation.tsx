"use client";

import { DASHBOARD_PAGES } from "@/config/pages-url.config";
import { useProfile } from "@/hook/useProfile";
import { scheduleService } from "@/services/schedule.service";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export const Generation = () => {
	const { data: profile } = useProfile();

	const { data: schedules } = useQuery({
		queryKey: ["schedules_query"],
		queryFn: () => scheduleService.getAllUsersSchedule(profile!.api_key),
		select: data => data.data,
	});

	return (
		<>
			{schedules && (
				<>
					{schedules.map(schedule => (
						<div>
							<h2>{schedule.title}</h2>
							<div>
								<Link href={`${DASHBOARD_PAGES.GENERATION}/${schedule.id}`}>
									Перейти
								</Link>
							</div>
							<hr />
						</div>
					))}
				</>
			)}
		</>
	);
};
