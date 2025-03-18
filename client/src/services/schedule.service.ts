import { axiosWithAuto } from "@/api/interceptors";
import { ISchedule, TypeScheduleForm } from "@/types/schedule.types";
import { AxiosResponse } from "axios";
class ScheduleService {
	private BASE_URL = "/schedule";

	async schedule(data: TypeScheduleForm, api: string) {
		const response = await axiosWithAuto.post(
			`${this.BASE_URL}/generate?api-key=${api}`,
			data
		);
		console.log(`${this.BASE_URL}/generate`);

		return response;
	}

	async getSchedule(api: string): Promise<AxiosResponse<ISchedule>> {
		const response = await axiosWithAuto.get(
			`${this.BASE_URL}/generate?api-key=${api}`
		);
		return response;
	}
}

export const scheduleService = new ScheduleService();
