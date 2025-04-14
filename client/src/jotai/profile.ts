import { IUser } from "@/types/auth.types";
import { atom } from "jotai";

export const profileDataAtom = atom<IUser | null>(null);
