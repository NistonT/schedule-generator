import { IAmountLimits } from "./amountLimits.type";
import { ILimitCabinets } from "./IlimitCabinets.type";
import { IMapSubject } from "./mapSubject.type";
import { IMapTeacher } from "./mapTeacher.type";
import { IUser } from "./user.type";

export interface ILesson {
	id: number;
	date: string;
	group: string;
	lesson: number;
	cabinet: string;
	subject: string;
	teacher: string;
	lessonType: string;
}

export interface ISchedule {
	id: string;
	user: IUser;
	user_id: string;

	title: string;
	description: string;

	cabinets: string[];
	groups: string[];
	teachers: TypeTeachers[];

	isShow?: boolean;
	schedule_count: number;

	schedule: {
		schedule: ILesson[][];
		failedAllocations: [];
	} | null;
	scheduleMain: {} | null;
	failed: {} | null;

	mapSubjects: IMapSubject[];
	mapTeachers: IMapTeacher[];
	amountLimits: IAmountLimits[];
	limitCabinets: ILimitCabinets[];

	CreatedAt: string;
	UpdatedAt: string;
}

export type SetAtom<Args extends any[], Result> = (...args: Args) => Result;

export type CombinedRecord = {
	group: string;
	subject: string;
	teacherName: string;
	amount: number;
	lessonType: "L" | "1" | "2";
};

export interface IMessageHandleAdd {
	messageAdd: string;
	messageAlready: string;
	messageRemove: string;
}

export type TypeTeachers = {
	tid: number;
	name: string;
	schedule?: ISchedule;
};

export type TypeTeachersMap = {
	tid: number;
	subject: string;
	group: string;
};

export type TypeAmountLimits = {
	group: string;
	subject: string;
	amount: number;
	lessonType: string;
};

export type TypeCabinetLimits = {
	tid: number;
	cabinets: string[];
};

export type TypeScheduleForm = {
	cabinets: string[];
	groups: string[];
	teachers: TypeTeachers[];
	subjectsMap: Record<string, string[]>;
	teachersMap: TypeTeachersMap[];
	amountLimits: TypeAmountLimits[];
	cabinetLimits: TypeCabinetLimits[];
	days: string[];
	maxLoad: number;
};

export type TypeGetSchedule = {
	cabinet: string;
	group: string;
	lessonType: string;
	subject: string;
	teacher: string;
};

export interface IGroupedDays {
	date: string;
	lessons: ILesson[];
}

export type IMonthItem = {
	name: string;
	value: number;
};
