"use client";
import { useProfile } from "@/hook/useProfile";
import { scheduleService } from "@/services/schedule.service";
import { useQuery } from "@tanstack/react-query";

type Props = {
	id: number;
};

export const GenerationId = ({ id }: Props) => {
	const { data: profile } = useProfile();

	const { data: schedule_id } = useQuery({
		queryKey: ["schedule_id"],
		queryFn: () => scheduleService.getSchedule(profile!.api_key, String(id)),
		select: data => data.data,
	});

	return <>{schedule_id?.title}</>;
};
