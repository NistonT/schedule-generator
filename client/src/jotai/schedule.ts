import {
	ISchedule,
	IScheduleGetList,
	TypeAmountLimits,
	TypeCabinetLimits,
	TypeScheduleForm,
	TypeTeachers,
	TypeTeachersMap,
} from "@/types/schedule.type";
import { atom } from "jotai";

export const cabinetsAtom = atom<string[]>([]);
export const groupsAtom = atom<string[]>([]);
export const teachersAtom = atom<TypeTeachers[]>([]);
export const subjectsMapAtom = atom<Record<string, string[]>>({});
export const teachersMapAtom = atom<TypeTeachersMap[]>([]);
export const amountLimitsAtom = atom<TypeAmountLimits[]>([]);
export const cabinetLimitsAtom = atom<TypeCabinetLimits[]>([]);
export const daysAtom = atom<string[]>([]);
export const maxLoadAtom = atom<number>(6);

export const countTeacherAtom = atom<number>(1);

export const currentScheduleAtom = atom<IScheduleGetList | null>(null);

export const generationCurrentScheduleFormAtom = atom<TypeScheduleForm | null>(
	null
);

export const scheduleListAtom = atom<IScheduleGetList[] | null>(null);

export const isPendingAtom = atom<boolean>(false);

export const scheduleIdAtom = atom<IScheduleGetList[] | null>(null);

export const scheduleAtom = atom<ISchedule | null | undefined>(null);
