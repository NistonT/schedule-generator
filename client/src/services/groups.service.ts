import { axiosWithAuto } from "@/api/interceptors";
import { IAddField, IDeleteField, IPutField } from "@/types/generation.types";

class GroupsService {
	private BASE_URL = "/groups";
	private API_QUERY = `?api-key=`;

	async addGroups(data: IAddField, api: string) {
		const response = await axiosWithAuto.post(
			`${this.BASE_URL}${this.API_QUERY}${api}`,
			data
		);

		return response;
	}

	async getGroups(api: string) {
		const response = await axiosWithAuto.get(
			`${this.BASE_URL}${this.API_QUERY}${api}`
		);

		return response;
	}

	async changeGroups(data: IPutField, api: string) {
		const response = await axiosWithAuto.put(
			`${this.BASE_URL}${this.API_QUERY}${api}`,
			data
		);

		return response;
	}

	async deleteGroups(data: IDeleteField, api: string) {
		const response = await axiosWithAuto.delete(
			`${this.BASE_URL}${this.API_QUERY}${api}`,
			{
				data,
			}
		);

		return response;
	}
}

export const groupService = new GroupsService();
