"use client";
import { DASHBOARD_PAGES } from "@/config/pages-url.config";
import { useProfile } from "@/hook/useProfile";
import { scheduleService } from "@/services/schedule.service";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export const Schedule = () => {
	const { data: profile } = useProfile();

	const {
		data: list_schedule,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["list_schedule"],
		queryFn: () => scheduleService.getAllUsersSchedule(profile!.api_key),
		select: data => data.data,
	});

	return (
		<div>
			{!isLoading && !isError ? (
				<>
					{list_schedule?.map(schedule => (
						<div key={schedule.id}>
							<div>{schedule.title}</div>
							<div>{schedule.description}</div>
							<div>{schedule.CreatedAt}</div>
							<div>{schedule.UpdatedAt}</div>
							<div>{schedule.id}</div>
							<div>{schedule.isShow}</div>
							<div>{schedule.schedule_count} coubt</div>
							<Link href={`${DASHBOARD_PAGES.SCHEDULE_ID}${schedule.id}`}>
								Перейти
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
