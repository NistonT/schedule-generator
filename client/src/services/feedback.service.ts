class FeedbackService {
	private BASE_URL = "/feedback";
	private USER_QUERY = "?user_id=";

	async addFeedback() {}

	async adminFeedback() {}

	async getUserFeedback() {}

	async getAllUserFeedback() {}

	async putFeedback() {}

	async deleteFeedback() {}
}

export const feedbackService = new FeedbackService();
