import { axiosWithAuto } from "@/api/interceptors";
import { TypeScheduleForm } from "@/types/schedule.types";
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
}

export const scheduleService = new ScheduleService();
