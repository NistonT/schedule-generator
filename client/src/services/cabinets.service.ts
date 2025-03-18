import { axiosWithAuto } from "@/api/interceptors";

export interface IPutCabinets {
	oldName: string;
	newName: string;
}

class CabinetsService {
	private BASE_URL = "/cabinets";
	private API_QUERY = `?api-key=`;

	async addCabinets(name: string, api: string) {
		const response = await axiosWithAuto.post(
			`${this.BASE_URL}${this.API_QUERY}${api}`,
			name
		);

		return response;
	}

	async getCabinets(api: string) {
		const response = await axiosWithAuto.get(
			`${this.BASE_URL}${this.API_QUERY}${api}`
		);

		return response;
	}

	async putCabinets(data: IPutCabinets, api: string) {
		const response = await axiosWithAuto.put(
			`${this.BASE_URL}${this.API_QUERY}${api}`,
			data
		);

		return response;
	}

	async deleteCabinets(name: string, api: string) {
		const response = await axiosWithAuto.delete(
			`${this.BASE_URL}${this.API_QUERY}${api}`,
			{
				data: name,
			}
		);
		return response;
	}
}

export const scheduleService = new CabinetsService();
