import { ISchedule } from "./schedule.type";

export interface IMapTeacher {
	id: number;
	tid: number;
	subject: string;
	group: string;
	scheduleId?: string;
	Schedule?: ISchedule;
}
