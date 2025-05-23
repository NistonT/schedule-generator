import { axiosWithAuto } from "@/api/interceptors";
import { IDeleteField, IPutField } from "@/types/generation.type";
import { ISchedule } from "@/types/schedule.type";
import { AxiosResponse } from "axios";

class CabinetsService {
	private BASE_URL = "/cabinets";
	private API_QUERY = `?api-key=`;
	private SCHEDULE_ID = `&schedule_id=`;

	// Добавить кабинет
	async addCabinets(
		name: string[],
		api: string,
		scheduleId: string
	): Promise<AxiosResponse<ISchedule>> {
		const response = await axiosWithAuto.post<ISchedule>(
			`${this.BASE_URL}${this.API_QUERY}${api}${this.SCHEDULE_ID}${scheduleId}`,
			{
				name,
			}
		);

		return response;
	}

	// Вывод кабинета
	async getCabinets(
		api: string,
		scheduleId: string
	): Promise<AxiosResponse<ISchedule>> {
		const response = await axiosWithAuto.get<ISchedule>(
			`${this.BASE_URL}/${this.API_QUERY}${api}${this.SCHEDULE_ID}${scheduleId}`
		);

		return response;
	}

	// Вывод всех кабинетов
	async getAllCabinets(
		api: string,
		scheduleId: string
	): Promise<AxiosResponse<ISchedule>> {
		const response = await axiosWithAuto.get<ISchedule>(
			`${this.BASE_URL}/all${this.API_QUERY}${api}${this.SCHEDULE_ID}${scheduleId}`
		);

		return response;
	}

	// Изменить кабинет
	async putCabinets(
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

	// Удалить кабинет
	async deleteCabinets(
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

export const cabinetService = new CabinetsService();
