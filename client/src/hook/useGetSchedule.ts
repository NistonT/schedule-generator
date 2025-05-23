import { scheduleService } from "@/services/schedule.service";
import { IUser } from "@/types/user.type";
import { useQuery } from "@tanstack/react-query";

export const useGetSchedule = (profile: IUser, schedule_id: string) => {
	const {
		data: schedule,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["get_schedule_id"],
		queryFn: () => scheduleService.getSchedule(profile!.api_key, schedule_id),
		select: data => data.data,
	});

	return { schedule, isLoading, isError };
};
