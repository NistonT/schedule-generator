"use client";
import {
	EnumTypeField,
	MainField,
} from "@/components/MainGeneration/MainField";

import { useProfile } from "@/hook/useProfile";
import {
	dataIsLoadingAtom,
	dataProfileAtom,
	dataScheduleAtom,
} from "@/jotai/generation";
import { useSetAtom } from "jotai";
import { useEffect } from "react";

export const Generation = () => {
	const { data } = useProfile();

	// const { data: dataQuery, isLoading } = useQuery({
	// 	queryKey: ["generation"],
	// 	queryFn: () => scheduleService.getSchedule(data!.api_key),
	// 	select: data => data.data,
	// });

	const setDataProfile = useSetAtom(dataProfileAtom);
	const setDataSchedule = useSetAtom(dataScheduleAtom);
	const setDataIsLoading = useSetAtom(dataIsLoadingAtom);

	useEffect(() => {
		if (data) {
			setDataProfile(data);
		}
	}, [data]);

	// useEffect(() => {
	// 	if (dataQuery) {
	// 		setDataSchedule(dataQuery);
	// 	}
	// }, [dataQuery]);

	// useEffect(() => {
	// 	setDataIsLoading(isLoading);
	// }, [isLoading]);

	return (
		<>
			<div className='space-y-6'>
				<MainField
					title={"Кабинеты"}
					field={EnumTypeField.CABINETS}
					label={"Кабинет"}
					name={"cabinet"}
				/>
				<MainField
					title={"Группы"}
					field={EnumTypeField.GROUP}
					label={"Группа"}
					name={"group"}
				/>
				<MainField
					title={"Преподаватели"}
					field={EnumTypeField.TEACHERS}
					label={"Преподаватель"}
					name={"teacher"}
				/>
			</div>
		</>
	);
};
