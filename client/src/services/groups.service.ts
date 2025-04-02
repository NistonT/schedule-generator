import { axiosWithAuto } from "@/api/interceptors";
import { IAddField, IDeleteField, IPutField } from "@/types/generation.types";

class GroupsService {
	private BASE_URL = "/groups";
	private API_QUERY = `?api-key=`;
	private SCHEDULE_ID = `?schedule_id=`;

	async addGroups(data: IAddField, api: string, scheduleId: string) {
		const response = await axiosWithAuto.post(
			`${this.BASE_URL}${this.API_QUERY}${api}${this.SCHEDULE_ID}${scheduleId}`,
			data
		);

		return response;
	}

	async getGroups(api: string, scheduleId: string) {
		const response = await axiosWithAuto.get(
			`${this.BASE_URL}${this.API_QUERY}${api}${this.SCHEDULE_ID}${scheduleId}`
		);

		return response;
	}

	async getAllGroups(api: string) {
		const response = await axiosWithAuto.get(
			`${this.BASE_URL}/all${this.API_QUERY}${api}`
		);

		return response;
	}

	async changeGroups(data: IPutField, api: string, scheduleId: string) {
		const response = await axiosWithAuto.put(
			`${this.BASE_URL}${this.API_QUERY}${api}${this.SCHEDULE_ID}${scheduleId}`,
			data
		);

		return response;
	}

	async deleteGroups(data: IDeleteField, api: string, scheduleId: string) {
		const response = await axiosWithAuto.delete(
			`${this.BASE_URL}${this.API_QUERY}${api}${this.SCHEDULE_ID}${scheduleId}`,
			{
				data,
			}
		);

		return response;
	}
}

export const groupService = new GroupsService();
