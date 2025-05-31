import { IUser } from "@/types/user.type";
import { atom } from "jotai";

export const profileDataAtom = atom<IUser | null>(null);
