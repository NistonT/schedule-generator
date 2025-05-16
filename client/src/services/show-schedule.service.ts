import { axiosWithAuto } from "@/api/interceptors";
import { AxiosResponse } from "axios";
import { ISchedule } from "../types/schedule.type";

class ShowScheduleService {
	private BASE_URL = "/title-schedule";
	private API_QUERY = `?api-key=`;
	private SCHEDULE_ID = `&schedule_id=`;

	async showSchedule(
		api: string,
		scheduleId: string
	): Promise<AxiosResponse<ISchedule>> {
		const response = await axiosWithAuto.post<ISchedule>(
			`${this.BASE_URL}${this.API_QUERY}${api}${this.SCHEDULE_ID}${scheduleId}`
		);

		return response;
	}
}

export const showScheduleService = new ShowScheduleService();
