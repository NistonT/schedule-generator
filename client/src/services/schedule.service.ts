import { axiosWithAuto } from "@/api/interceptors";
import { ISchedule, TypeScheduleForm } from "@/types/schedule.types";
import { AxiosResponse } from "axios";
class ScheduleService {
	private BASE_URL = "/schedule";
	private API_QUERY = `?api-key=`;
	private SCHEDULE_ID = `?schedule_id=`;

	// Генерировать определенное расписание
	async schedule(data: TypeScheduleForm, api: string, scheduleId: string) {
		const response = await axiosWithAuto.post(
			`${this.BASE_URL}/generate${this.API_QUERY}${api}${this.SCHEDULE_ID}${scheduleId}`,
			data
		);

		return response;
	}

	// Создать расписание
	async createSchedule(
		api: string,
		data: TypeScheduleForm,
		scheduleId: string
	): Promise<AxiosResponse<ISchedule | null>> {
		const response = await axiosWithAuto.post(
			`${this.BASE_URL}/create${this.API_QUERY}${api}${this.SCHEDULE_ID}${scheduleId}`,
			data
		);

		return response;
	}

	// Показать все расписании
	async getAllSchedule(api: string): Promise<AxiosResponse<ISchedule | null>> {
		const response = await axiosWithAuto.get(
			`${this.BASE_URL}/all${this.API_QUERY}${api}`
		);
		return response;
	}

	// Показать определенное расписание
	async getSchedule(
		api: string,
		scheduleId: string
	): Promise<AxiosResponse<ISchedule | null>> {
		const response = await axiosWithAuto.get(
			`${this.BASE_URL}${this.API_QUERY}${api}${this.SCHEDULE_ID}${scheduleId}`
		);
		return response;
	}

	// default service

	// Получить все расписание
	async getAllUsersSchedule(
		api: string
	): Promise<AxiosResponse<ISchedule | null>> {
		const response = await axiosWithAuto.get(
			`${this.BASE_URL}/users/all${this.API_QUERY}${api}`
		);
		return response;
	}

	// Получить последние расписание
	async getLatestSchedule(
		api: string
	): Promise<AxiosResponse<ISchedule | null>> {
		const response = await axiosWithAuto.get(
			`${this.BASE_URL}/latest${this.API_QUERY}${api}`
		);

		return response;
	}
}

export const scheduleService = new ScheduleService();
