import { atom } from "jotai";

export type ViewMode = "day" | "week" | "month";

export const viewModeAtom = atom<ViewMode>("day");

export const excludedDaysOfWeekAtom = atom<Set<number>>(new Set([0, 6]));
