import { axiosWithAuto } from "@/api/interceptors";
import { ISchedule } from "@/types/schedule.type";
import { AxiosResponse } from "axios";

class DescriptionScheduleService {
	private BASE_URL = "/description-schedule";
	private API_QUERY = `?api-key=`;
	private SCHEDULE_ID = `&schedule_id=`;

	// Добавить расписание
	async addDescription(
		text: string,
		api: string,
		scheduleId: string
	): Promise<AxiosResponse<ISchedule>> {
		const response = await axiosWithAuto.post<ISchedule>(
			`${this.BASE_URL}${this.API_QUERY}${api}${this.SCHEDULE_ID}${scheduleId}`,
			{
				text: text,
			}
		);

		return response;
	}

	// Изменить расписание
	async putDescription(
		text: string,
		api: string,
		scheduleId: string
	): Promise<AxiosResponse<ISchedule>> {
		const response = await axiosWithAuto.put<ISchedule>(
			`${this.BASE_URL}${this.API_QUERY}${api}${this.SCHEDULE_ID}${scheduleId}`,
			{
				text: text,
			}
		);

		return response;
	}

	// Удалить расписание
	async deleteDescription(
		api: string,
		scheduleId: string
	): Promise<AxiosResponse<ISchedule>> {
		const response = await axiosWithAuto.delete<ISchedule>(
			`${this.BASE_URL}${this.API_QUERY}${api}${this.SCHEDULE_ID}${scheduleId}`
		);

		return response;
	}
}

export const descriptionScheduleService = new DescriptionScheduleService();
