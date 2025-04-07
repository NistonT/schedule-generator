"use client";

import { useProfile } from "@/hook/useProfile";
import {
	currentScheduleAtom,
	generationCurrentScheduleFormAtom,
	scheduleListAtom,
} from "@/jotai/schedule";
import { scheduleService } from "@/services/schedule.service";
import { IScheduleGetList, TypeScheduleForm } from "@/types/schedule.types";
import { useMutation } from "@tanstack/react-query";
import { useAtom, useAtomValue } from "jotai";
import { toast } from "sonner";

export const CreateSchedule = () => {
	const { data } = useProfile();
	const generationCurrentScheduleForm = useAtomValue<TypeScheduleForm | null>(
		generationCurrentScheduleFormAtom
	);
	const [scheduleListState, setScheduleListState] = useAtom<
		IScheduleGetList[] | null
	>(scheduleListAtom);
	const [currentSchedule, setCurrentSchedule] =
		useAtom<IScheduleGetList | null>(currentScheduleAtom);

	// const { mutate: addCabinets } = useMutation({
	// 	mutationKey: ["add_cabinets"],
	// 	mutationFn: () =>
	// 		cabinetService.addCabinets(
	// 			[...generationCurrentScheduleForm!.cabinets],
	// 			data!.api_key,
	// 			currentSchedule!.id
	// 		),
	// 	onError: error => {
	// 		console.log(error.message);
	// 	},
	// });

	const { mutate } = useMutation({
		mutationKey: ["create_schedule"],
		mutationFn: () =>
			scheduleService.createSchedule(
				data!.api_key,
				generationCurrentScheduleForm!
			),
		onSuccess: (response: { data: IScheduleGetList }) => {
			setScheduleListState(prev => [...(prev || []), response.data]);
			setCurrentSchedule(response.data);
			// addCabinets();
			toast.success("Расписание создано");
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
			className='bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700'
		>
			Создать пустое расписание
		</button>
	);
};
