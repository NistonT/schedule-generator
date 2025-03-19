import { axiosWithAuto } from "@/api/interceptors";
import { IAddField, IDeleteField, IPutField } from "@/types/generation.types";

class CabinetsService {
	private BASE_URL = "/cabinets";
	private API_QUERY = `?api-key=`;

	async addCabinets(data: IAddField, api: string) {
		const response = await axiosWithAuto.post(
			`${this.BASE_URL}${this.API_QUERY}${api}`,
			data
		);

		return response;
	}

	async getCabinets(api: string) {
		const response = await axiosWithAuto.get(
			`${this.BASE_URL}${this.API_QUERY}${api}`
		);

		return response;
	}

	async putCabinets(data: IPutField, api: string) {
		const response = await axiosWithAuto.put(
			`${this.BASE_URL}${this.API_QUERY}${api}`,
			data
		);

		return response;
	}

	async deleteCabinets(data: IDeleteField, api: string) {
		const response = await axiosWithAuto.delete(
			`${this.BASE_URL}${this.API_QUERY}${api}`,
			{
				data,
			}
		);
		return response;
	}
}

export const cabinetService = new CabinetsService();
