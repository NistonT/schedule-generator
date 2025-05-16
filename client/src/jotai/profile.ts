import { IUser } from "@/types/auth.type";
import { atom } from "jotai";

export const profileDataAtom = atom<IUser | null>(null);
