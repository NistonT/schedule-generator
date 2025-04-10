import { axiosWithAuto } from "@/api/interceptors";
import {
	IAddFeedback,
	IAdminFeedback,
	IChangeFeedback,
	IFeedback,
} from "@/types/feedback.types";
import { AxiosResponse } from "axios";

class FeedbackService {
	private BASE_URL = "/feedback";
	private USER_QUERY = "?user_id=";
	private FEEDBACK_QUERY = "?feedback_id=";

	// Добавление записи
	async addFeedback(data: IAddFeedback, user_id: string) {
		const response = await axiosWithAuto.post(
			`${this.BASE_URL}${this.USER_QUERY}${user_id}`,
			data
		);

		return response;
	}

	// Ответ на запись
	async adminFeedback(data: IAdminFeedback, feedback_id: string) {
		const response = await axiosWithAuto.post(
			`${this.BASE_URL}/admin${this.FEEDBACK_QUERY}${feedback_id}`,
			data
		);

		return response;
	}

	// Получение одной записи
	async getIdFeedback(feedback_id: string): Promise<AxiosResponse<IFeedback>> {
		const response = await axiosWithAuto.get(
			`${this.BASE_URL}/id${this.FEEDBACK_QUERY}${feedback_id}`
		);

		return response;
	}

	// Получение всех записей пользователей
	async getUserFeedback(user_id: string): Promise<AxiosResponse<IFeedback[]>> {
		const response = await axiosWithAuto.get(
			`${this.BASE_URL}${this.USER_QUERY}${user_id}`
		);

		return response;
	}

	// Получение все записей
	async getAllUserFeedback(): Promise<AxiosResponse<IFeedback[]>> {
		const response = await axiosWithAuto.get(`${this.BASE_URL}/all`);

		return response;
	}

	// Изменить запись
	async putFeedback(data: IChangeFeedback, feedback_id: string) {
		const response = await axiosWithAuto.put(
			`${this.BASE_URL}${this.FEEDBACK_QUERY}${feedback_id}`,
			data
		);

		return response;
	}

	// Удалить запись
	async deleteFeedback(feedback_id: string) {
		const response = await axiosWithAuto.delete(
			`${this.BASE_URL}${this.FEEDBACK_QUERY}${feedback_id}`
		);

		return response;
	}
}

export const feedbackService = new FeedbackService();
