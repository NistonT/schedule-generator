import { ISchedule } from "./schedule.type";

export interface ITeacher {
	tid: number;
	name: string;

	schedule_id: string;
	schedule?: ISchedule;
}

export interface ITeacherNotSchedule {
	tid: number;
	name: string;
}

export interface IAddTeacherForm {
	name: string;
}
