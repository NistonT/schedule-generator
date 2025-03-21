"use client";

import { dataIsLoadingAtom, dataScheduleAtom } from "@/jotai/generation";
import { ISchedule } from "@/types/schedule.types";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { LoadingGeneration } from "../Loading/LoadingGeneration";
import { AddField } from "./AddField";
import { Field } from "./Field";

export const EnumTypeField = {
	CABINETS: "CABINETS",
	GROUP: "GROUP",
	TEACHERS: "TEACHERS",
} as const;

export type EnumTypeField = (typeof EnumTypeField)[keyof typeof EnumTypeField];

type Props = {
	title: string;
	field: EnumTypeField;
	label: string;
	name: string;
};

export const MainField = ({ title, field, name, label }: Props) => {
	const isLoading = useAtomValue<boolean>(dataIsLoadingAtom);
	const dataSchedule = useAtomValue<ISchedule | null>(dataScheduleAtom);

	const [fields, setField] = useState<string[] | any>([]);

	useEffect(() => {
		if (!dataSchedule) return;

		if (field === "CABINETS") {
			setField(dataSchedule?.cabinets);
		} else if (field === "GROUP") {
			setField(dataSchedule?.groups);
		} else if (field === "TEACHERS") {
			setField(dataSchedule?.teachers);
		}
	}, [dataSchedule]);

	return (
		<div className='bg-white rounded-lg p-6'>
			<h2 className='text-xl font-semibold text-gray-800 mb-4'>{title}</h2>
			{!isLoading ? (
				<>
					<div className='flex items-center gap-1 flex-wrap'>
						{field === "TEACHERS" ? (
							<>
								{fields.map((field: any) => (
									<div
										key={field.tid}
										className='px-4 py-2 bg-gray-100 rounded-md text-gray-700'
									>
										{field.name}
									</div>
								))}
							</>
						) : (
							<>
								{fields.map((fieldElem: any) => (
									<Field fieldElem={fieldElem} field={field} />
								))}
							</>
						)}
					</div>
					<AddField name={name} label={label} field={field} />
				</>
			) : (
				<LoadingGeneration />
			)}
		</div>
	);
};
