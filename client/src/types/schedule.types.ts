export interface Lesson {
	group: string;
	cabinet: string;
	subject: string;
	teacher: string;
	lessonType: string;
}

type DaySchedule = Lesson[][];
interface GroupSchedule {
	[day: string]: DaySchedule;
}
export interface GroupTimetables {
	[group: string]: GroupSchedule;
}

export interface ISchedule {
	cabinets: string[];
	groups: string[];
	schedule: GroupTimetables;
	teachers: TypeTeachers[];
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
