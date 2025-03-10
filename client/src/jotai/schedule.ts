import {
	TypeAmountLimits,
	TypeCabinetLimits,
	TypeTeachers,
	TypeTeachersMap,
} from "@/types/schedule.types";
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
export const hoursAtom = atom<Record<string, number[]>>({});

export const countTeacherAtom = atom<number>(1);
