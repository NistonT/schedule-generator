import { scheduleService } from "@/services/schedule.service";
import { IUser } from "@/types/user.type";
import { useQuery } from "@tanstack/react-query";

export const useGetAllUsersSchedule = (profile: IUser | null) => {
	const {
		data: list_schedule,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["list_schedule"],
		queryFn: () => scheduleService.getAllUsersSchedule(profile!.api_key),
		select: data => data.data,
	});

	return { list_schedule, isLoading, isError };
};
