import { ISchedule } from "./schedule.type";
import { ISubject } from "./subject.type";

export interface IMapSubject {
	id: number;
	name_group: string;
	subjects: ISubject[];
	scheduleId?: string;
	Schedule: ISchedule;
}
