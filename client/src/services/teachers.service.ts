import { axiosWithAuto } from "@/api/interceptors";
import {
	IAddField,
	IDeleteFieldNumber,
	IPutFieldNumber,
} from "@/types/generation.type";
import { ITeacher } from "@/types/teacher.type";
import { AxiosResponse } from "axios";
class TeachersService {
	private BASE_URL = "/teachers";
	private API_QUERY = `?api-key=`;
	private SCHEDULE_ID = `?schedule_id=`;

	// Создать преподавателя
	async addTeachers(
		data: IAddField,
		api: string,
		scheduleId: string
	): Promise<AxiosResponse<ITeacher>> {
		const response = await axiosWithAuto.post<ITeacher>(
			`${this.BASE_URL}${this.API_QUERY}${api}${this.SCHEDULE_ID}${scheduleId}`,
			data
		);

		return response;
	}

	// Получить всех преподавателей из одного расписание
	async getTeachers(
		api: string,
		scheduleId: string
	): Promise<AxiosResponse<ITeacher[]>> {
		const response = await axiosWithAuto.get<ITeacher[]>(
			`${this.BASE_URL}${this.API_QUERY}${api}${this.SCHEDULE_ID}${scheduleId}`
		);

		return response;
	}

	// Получить все преподавателей
	async getAllTeachers(api: string): Promise<AxiosResponse<ITeacher[]>> {
		const response = await axiosWithAuto.get<ITeacher[]>(
			`${this.BASE_URL}${this.API_QUERY}${api}`
		);

		return response;
	}

	// Изменить преподавателя
	async changeTeachers(
		data: IPutFieldNumber,
		api: string,
		scheduleId: string
	): Promise<AxiosResponse<ITeacher>> {
		const response = await axiosWithAuto.put<ITeacher>(
			`${this.BASE_URL}${this.API_QUERY}${api}${this.SCHEDULE_ID}${scheduleId}`,
			data
		);

		return response;
	}

	// Удалить преподавателя
	async deleteTeachers(
		data: IDeleteFieldNumber,
		api: string,
		scheduleId: string
	): Promise<AxiosResponse<ITeacher>> {
		const response = await axiosWithAuto.delete<ITeacher>(
			`${this.BASE_URL}${this.API_QUERY}${api}${this.SCHEDULE_ID}${scheduleId}`,
			{
				data,
			}
		);

		return response;
	}
}

export const teachersService = new TeachersService();
