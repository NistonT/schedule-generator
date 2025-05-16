import { ISchedule } from "./schedule.type";

export interface ILimitCabinets {
	id: number;
	tid: number;
	cabinets: String[];
	scheduleId?: string;
	Schedule: ISchedule;
}
