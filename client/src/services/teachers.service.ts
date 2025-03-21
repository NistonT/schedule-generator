import { axiosWithAuto } from "@/api/interceptors";
import { IAddField, IDeleteField, IPutField } from "@/types/generation.types";

class TeachersService {
	private BASE_URL = "/teachers";
	private API_QUERY = `?api-key=`;

	async addTeachers(data: IAddField, api: string) {
		const response = await axiosWithAuto.post(
			`${this.BASE_URL}${this.API_QUERY}${api}`,
			data
		);

		return response;
	}

	async getTeachers(api: string) {
		const response = await axiosWithAuto.get(
			`${this.BASE_URL}${this.API_QUERY}${api}`
		);

		return response;
	}

	async changeTeachers(data: IPutField, api: string) {
		const response = await axiosWithAuto.put(
			`${this.BASE_URL}${this.API_QUERY}${api}`,
			data
		);

		return response;
	}

	async deleteTeachers(data: IDeleteField, api: string) {
		const response = await axiosWithAuto.delete(
			`${this.BASE_URL}${this.API_QUERY}${api}`,
			{
				data,
			}
		);

		return response;
	}
}

export const teachersService = new TeachersService();
