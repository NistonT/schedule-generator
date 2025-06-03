import { ISchedule } from "@/types/schedule.type";
import { IUser } from "@/types/user.type";
import { atom } from "jotai";

export const dataProfileAtom = atom<IUser | null>(null);
export const dataScheduleAtom = atom<ISchedule | null>(null);
export const dataIsLoadingAtom = atom<boolean>(true);

export const cabinetsGenerationAtom = atom<string[]>([]);
