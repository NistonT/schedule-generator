import { axiosWithAuto } from "@/api/interceptors";

class DescriptionScheduleService {
	private BASE_URL = "/description-schedule";
	private API_QUERY = `?api-key=`;
	private SCHEDULE_ID = `&schedule_id=`;

	async addDescription(text: string, api: string, scheduleId: string) {
		const response = await axiosWithAuto.post(
			`${this.BASE_URL}${this.API_QUERY}${api}${this.SCHEDULE_ID}${scheduleId}`,
			{
				description: text,
			}
		);

		return response;
	}

	async putDescription(text: string, api: string, scheduleId: string) {
		const response = await axiosWithAuto.put(
			`${this.BASE_URL}${this.API_QUERY}${api}${this.SCHEDULE_ID}${scheduleId}`,
			{
				text: text,
			}
		);

		return response;
	}

	async deleteDescription(api: string, scheduleId: string) {
		const response = await axiosWithAuto.delete(
			`${this.BASE_URL}${this.API_QUERY}${api}${this.SCHEDULE_ID}${scheduleId}`
		);

		return response;
	}
}

export const descriptionScheduleService = new DescriptionScheduleService();
