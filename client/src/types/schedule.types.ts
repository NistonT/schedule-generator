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
	days: number;
	maxLoad: number;
	hours: Record<string, number[]>;
};

export type TypeGetSchedule = {
	cabinet: string;
	group: string;
	lessonType: string;
	subject: string;
	teacher: string;
};
