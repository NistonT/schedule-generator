"use client";
import {
	EnumTypeField,
	MainFieldArray,
} from "@/components/MainGeneration/MainFieldArray";
import {
	EnumTypeFieldObject,
	MainFieldObject,
} from "@/components/MainGeneration/MainFieldObject";
import { useProfile } from "@/hook/useProfile";
import {
	dataIsLoadingAtom,
	dataProfileAtom,
	dataScheduleAtom,
} from "@/jotai/generation";
import { scheduleService } from "@/services/schedule.service";
import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useEffect } from "react";

export const Generation = () => {
	const { data } = useProfile();

	const { data: dataQuery, isLoading } = useQuery({
		queryKey: ["generation"],
		queryFn: () => scheduleService.getSchedule(data!.api_key),
		select: data => data.data,
	});

	const setDataProfile = useSetAtom(dataProfileAtom);
	const setDataSchedule = useSetAtom(dataScheduleAtom);
	const setDataIsLoading = useSetAtom(dataIsLoadingAtom);

	useEffect(() => {
		if (data) {
			setDataProfile(data);
		}
	}, [data]);

	useEffect(() => {
		if (dataQuery) {
			setDataSchedule(dataQuery);
		}
	}, [dataQuery]);

	useEffect(() => {
		setDataIsLoading(isLoading);
	}, [isLoading]);

	return (
		<>
			<div className='space-y-6'>
				<MainFieldArray title={"Кабинеты"} field={EnumTypeField.CABINETS} />
				<MainFieldArray title={"Группы"} field={EnumTypeField.GROUP} />
				<MainFieldObject
					title={"Преподаватели"}
					field={EnumTypeFieldObject.Teachers}
				/>
			</div>
		</>
	);
};
