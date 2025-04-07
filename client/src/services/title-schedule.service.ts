import { axiosWithAuto } from "@/api/interceptors";

class TitleScheduleService {
	private BASE_URL = "/title-schedule";
	private API_QUERY = `?api-key=`;
	private SCHEDULE_ID = `?schedule_id=`;

	async addTitle(title: string, api: string, scheduleId: string) {
		const response = await axiosWithAuto.post(
			`${this.BASE_URL}${this.API_QUERY}${api}${this.SCHEDULE_ID}${scheduleId}`,
			{
				title: title,
			}
		);

		return response;
	}

	async putTitle(title: string, api: string, scheduleId: string) {
		const response = await axiosWithAuto.put(
			`${this.BASE_URL}${this.API_QUERY}${api}${this.SCHEDULE_ID}${scheduleId}`,
			{
				title: title,
			}
		);

		return response;
	}

	async deleteTitle(api: string, scheduleId: string) {
		const response = await axiosWithAuto.delete(
			`${this.BASE_URL}${this.API_QUERY}${api}${this.SCHEDULE_ID}${scheduleId}`
		);

		return response;
	}
}

export const titleScheduleService = new TitleScheduleService();
