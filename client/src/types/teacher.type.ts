import { ISchedule } from "./schedule.type";
export interface ITeacher {
	tid: number;
	name: string;

	Schedule?: ISchedule[];
}

export interface ITeacherNotSchedule {
	tid: number;
	name: string;
}
