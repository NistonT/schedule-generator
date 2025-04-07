import { axiosWithAuto } from "@/api/interceptors";

class ShowScheduleService {
	private BASE_URL = "/title-schedule";
	private API_QUERY = `?api-key=`;
	private SCHEDULE_ID = `?schedule_id=`;

	async showSchedule(api: string, scheduleId: string) {
		const response = await axiosWithAuto.post(
			`${this.BASE_URL}${this.API_QUERY}${api}${this.SCHEDULE_ID}${scheduleId}`
		);

		return response;
	}
}

export const showScheduleService = new ShowScheduleService();
