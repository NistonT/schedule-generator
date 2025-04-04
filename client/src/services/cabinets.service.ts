import { axiosWithAuto } from "@/api/interceptors";
import { IDeleteField, IPutField } from "@/types/generation.types";

class CabinetsService {
	private BASE_URL = "/cabinets";
	private API_QUERY = `?api-key=`;
	private SCHEDULE_ID = `&schedule_id=`;

	async addCabinets(name: string | string[], api: string, scheduleId: string) {
		const response = await axiosWithAuto.post(
			`${this.BASE_URL}${this.API_QUERY}${api}${this.SCHEDULE_ID}${scheduleId}`,
			{
				name,
			}
		);

		return response;
	}

	async getCabinets(api: string, scheduleId: string) {
		const response = await axiosWithAuto.get(
			`${this.BASE_URL}/${this.API_QUERY}${api}${this.SCHEDULE_ID}${scheduleId}`
		);

		return response;
	}

	async getAllCabinets(api: string, scheduleId: string) {
		const response = await axiosWithAuto.get(
			`${this.BASE_URL}/all${this.API_QUERY}${api}${this.SCHEDULE_ID}${scheduleId}`
		);

		return response;
	}

	async putCabinets(data: IPutField, api: string, scheduleId: string) {
		const response = await axiosWithAuto.put(
			`${this.BASE_URL}${this.API_QUERY}${api}${this.SCHEDULE_ID}${scheduleId}`,
			data
		);

		return response;
	}

	async deleteCabinets(data: IDeleteField, api: string, scheduleId: string) {
		const response = await axiosWithAuto.delete(
			`${this.BASE_URL}${this.API_QUERY}${api}${this.SCHEDULE_ID}${scheduleId}`,
			{
				data,
			}
		);

		return response;
	}
}

export const cabinetService = new CabinetsService();
