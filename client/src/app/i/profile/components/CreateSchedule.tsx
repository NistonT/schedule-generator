"use client";

import { useProfile } from "@/hook/useProfile";
import {
	amountLimitsAtom,
	cabinetLimitsAtom,
	cabinetsAtom,
	currentScheduleAtom,
	generationCurrentScheduleFormAtom,
	groupsAtom,
	scheduleListAtom,
	subjectsMapAtom,
	teachersAtom,
	teachersMapAtom,
} from "@/jotai/schedule";
import { scheduleService } from "@/services/schedule.service";
import { ISchedule, TypeScheduleForm } from "@/types/schedule.type";
import { useMutation } from "@tanstack/react-query";
import { useAtom, useAtomValue } from "jotai";
import { toast } from "sonner";

export const CreateSchedule = () => {
	const [cabinets, setCabinets] = useAtom(cabinetsAtom);
	const [groups, setGroups] = useAtom(groupsAtom);
	const [teachers, setTeachers] = useAtom(teachersAtom);
	const [subjectsMap, setSubjectsMap] = useAtom(subjectsMapAtom);
	const [teachersMap, setTeachersMap] = useAtom(teachersMapAtom);
	const [amountLimits, setAmountLimits] = useAtom(amountLimitsAtom);
	const [cabinetLimits, setCabinetLimits] = useAtom(cabinetLimitsAtom);

	const { data } = useProfile();
	const generationCurrentScheduleForm = useAtomValue<TypeScheduleForm | null>(
		generationCurrentScheduleFormAtom
	);
	const [scheduleListState, setScheduleListState] = useAtom<ISchedule[] | null>(
		scheduleListAtom
	);
	const [currentSchedule, setCurrentSchedule] = useAtom<ISchedule | null>(
		currentScheduleAtom
	);

	const { mutate } = useMutation({
		mutationKey: ["create_schedule"],
		mutationFn: () =>
			scheduleService.createSchedule(
				data!.api_key,
				generationCurrentScheduleForm!
			),
		onSuccess: (response: { data: ISchedule }) => {
			setScheduleListState(prev => [...(prev || []), response.data]);
			setCurrentSchedule(response.data);
			// addCabinets();
			toast.success("Расписание создано");
			setCabinets([]);
			setGroups([]);
			setTeachers([]);
			setSubjectsMap({});
			setTeachersMap([]);
			setAmountLimits([]);
			setCabinetLimits([]);
		},
		onError: error => {
			console.log(error);
			toast.error(error.message);
		},
	});

	const handlerCreateSchedule = () => {
		if (generationCurrentScheduleForm) {
			console.log(generationCurrentScheduleForm);
			mutate();
		} else {
			console.log(generationCurrentScheduleForm);
			toast.error("Необходимо заполнить форму");
		}
	};

	return (
		<button
			onClick={handlerCreateSchedule}
			type='submit'
			className='bg-gray-950 text-white px-4 py-2 rounded-md'
		>
			Создать пустое расписание
		</button>
	);
};
