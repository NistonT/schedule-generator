import { ISchedule } from "./schedule.type";

export interface IAmountLimits {
	id: number;
	group: string;
	subject: string;
	count: number;
	type_subject: string;
	scheduleId?: string;
	Schedule?: ISchedule;
}
