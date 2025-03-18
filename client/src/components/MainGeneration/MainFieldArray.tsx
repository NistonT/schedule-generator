"use client";

import {
	dataIsLoadingAtom,
	dataProfileAtom,
	dataScheduleAtom,
} from "@/jotai/generation";
import { IUser } from "@/types/auth.types";
import { ISchedule } from "@/types/schedule.types";
import { useAtom } from "jotai";
import { m } from "motion/react";
import { useEffect, useState } from "react";

export const EnumTypeField = {
	CABINETS: "CABINETS",
	GROUP: "GROUP",
} as const;

export type EnumTypeField = (typeof EnumTypeField)[keyof typeof EnumTypeField];

type Props = {
	title: string;
	field: EnumTypeField;
};

export const MainFieldArray = ({ title, field }: Props) => {
	const [isLoading, setIsLoading] = useAtom<boolean>(dataIsLoadingAtom);
	const [dataProfile, setDataProfile] = useAtom<IUser | null>(dataProfileAtom);
	const [dataSchedule, setDataSchedule] = useAtom<ISchedule | null>(
		dataScheduleAtom
	);

	const [fields, setField] = useState<string[]>([]);

	useEffect(() => {
		if (!dataSchedule) return;

		if (field === "CABINETS") {
			setField(dataSchedule?.cabinets);
		} else if (field === "GROUP") {
			setField(dataSchedule?.groups);
		}
	}, [dataSchedule]);

	return (
		<div className='bg-white shadow-md rounded-lg p-6'>
			<h2 className='text-xl font-semibold text-gray-800 mb-4'>{title}</h2>
			{!isLoading ? (
				<div className='flex items-center gap-1'>
					{fields.map(field => (
						<div
							key={field}
							className='px-4 py-2 bg-gray-100 rounded-md text-gray-700'
						>
							{field}
						</div>
					))}
				</div>
			) : (
				<div className='flex'>
					<m.div
						className='px-4 py-2 h-8 w-full bg-gray-100 rounded-md overflow-hidden relative shadow-sm'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<m.div
							initial={{ x: -150 }}
							animate={{ x: 1500 }}
							transition={{
								duration: 1,
								repeat: Infinity,
								repeatType: "loop",
								ease: "linear",
							}}
							className='w-32 h-full absolute top-0 left-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent'
						/>
					</m.div>
				</div>
			)}
		</div>
	);
};
