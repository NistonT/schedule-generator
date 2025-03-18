import { IUser } from "@/types/auth.types";
import { ISchedule } from "@/types/schedule.types";
import { atom } from "jotai";

export const dataProfileAtom = atom<IUser | null>(null);
export const dataScheduleAtom = atom<ISchedule | null>(null);
export const dataIsLoadingAtom = atom<boolean>(true);
