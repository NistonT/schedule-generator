import { axiosWithAuto } from "@/api/interceptors";
import { IAddField, IDeleteField, IPutField } from "@/types/generation.type";
import { ISchedule } from "@/types/schedule.type";
import { AxiosResponse } from "axios";

class GroupsService {
	private BASE_URL = "/groups";
	private API_QUERY = `?api-key=`;
	private SCHEDULE_ID = `?schedule_id=`;

	// Добавление группы в расписание
	async addGroups(
		data: IAddField,
		api: string,
		scheduleId: string
	): Promise<AxiosResponse<ISchedule>> {
		const response = await axiosWithAuto.post<ISchedule>(
			`${this.BASE_URL}${this.API_QUERY}${api}${this.SCHEDULE_ID}${scheduleId}`,
			data
		);

		return response;
	}

	// Вывод групп
	async getGroups(
		api: string,
		scheduleId: string
	): Promise<AxiosResponse<ISchedule>> {
		const response = await axiosWithAuto.get<ISchedule>(
			`${this.BASE_URL}${this.API_QUERY}${api}${this.SCHEDULE_ID}${scheduleId}`
		);

		return response;
	}

	// Вывод всех групп
	async getAllGroups(api: string): Promise<AxiosResponse<ISchedule[]>> {
		const response = await axiosWithAuto.get<ISchedule[]>(
			`${this.BASE_URL}/all${this.API_QUERY}${api}`
		);

		return response;
	}

	// Изменение групп
	async changeGroups(
		data: IPutField,
		api: string,
		scheduleId: string
	): Promise<AxiosResponse<ISchedule>> {
		const response = await axiosWithAuto.put<ISchedule>(
			`${this.BASE_URL}${this.API_QUERY}${api}${this.SCHEDULE_ID}${scheduleId}`,
			data
		);

		return response;
	}

	// Удаление группы
	async deleteGroups(
		data: IDeleteField,
		api: string,
		scheduleId: string
	): Promise<AxiosResponse<ISchedule>> {
		const response = await axiosWithAuto.delete<ISchedule>(
			`${this.BASE_URL}${this.API_QUERY}${api}${this.SCHEDULE_ID}${scheduleId}`,
			{
				data,
			}
		);

		return response;
	}
}

export const groupService = new GroupsService();
