"use client";

import { useProfile } from "@/hook/useProfile";
import {
	currentScheduleAtom,
	generationCurrentScheduleFormAtom,
} from "@/jotai/schedule";
import { cabinetService } from "@/services/cabinets.service";
import { scheduleService } from "@/services/schedule.service";
import { IScheduleGetList, TypeScheduleForm } from "@/types/schedule.types";
import { useMutation } from "@tanstack/react-query";
import { useAtom, useAtomValue } from "jotai";
import { toast } from "sonner";

export const GenerationSchedule = () => {
	const { data: profile } = useProfile();

	const generationCurrentScheduleForm = useAtomValue<TypeScheduleForm | null>(
		generationCurrentScheduleFormAtom
	);
	const [currentSchedule, setCurrentSchedule] =
		useAtom<IScheduleGetList | null>(currentScheduleAtom);

	const { mutate: addCabinets } = useMutation({
		mutationKey: ["add_cabinets"],
		mutationFn: () =>
			cabinetService.addCabinets(
				[...generationCurrentScheduleForm!.cabinets],
				profile!.api_key,
				currentSchedule!.id
			),
		onError: error => {
			console.log(error.message);
		},
	});

	const { mutate } = useMutation({
		mutationKey: ["generation_schedule"],
		mutationFn: () =>
			scheduleService.schedule(
				generationCurrentScheduleForm!,
				profile!.api_key,
				currentSchedule!.id
			),
		onSuccess: () => {
			toast.success("Расписание сгенерирована");
		},
		onError: error => {
			console.log(error);
			toast.error(error.message);
		},
	});

	const handlerGeneration = () => {
		if (generationCurrentScheduleForm) {
			console.log(generationCurrentScheduleForm);
			mutate();
			addCabinets();
		} else {
			console.log(generationCurrentScheduleForm);
			toast.error("Форма не заполнена");
		}
	};

	return (
		<button
			onClick={handlerGeneration}
			type='submit'
			className='bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700'
		>
			Сгенерировать
		</button>
	);
};
