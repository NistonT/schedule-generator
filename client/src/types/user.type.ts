import { IFeedback } from "./feedback.type";
import { ISchedule } from "./schedule.type";

export interface IUser {
	id: string;
	username: string;
	email: string;
	password: string;

	telegram_id?: string;

	schedule: ISchedule[];
	feedback: IFeedback[];
	api_key: string;

	visits: number;
	feedback_count: number;

	role: string;

	CreatedAt: string;
	UpdatedAt: string;
}
