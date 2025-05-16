"use client";

import { dataProfileAtom } from "@/jotai/generation";
import { cabinetService } from "@/services/cabinets.service";
import { groupService } from "@/services/groups.service";
import { teachersService } from "@/services/teachers.service";
import { IUser } from "@/types/auth.type";
import { IPutField } from "@/types/generation.type";
import { useMutation } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { PenLine } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { ButtonSubmit } from "../ui/buttons/ButtonSubmit";
import { EnumTypeField } from "./MainField";

type Props = {
	fieldElem: any;
	field: EnumTypeField;
};

export const PutField = ({ fieldElem, field }: Props) => {
	const { register, handleSubmit, reset } = useForm<IPutField>();
	const dataProfile = useAtomValue<IUser | null>(dataProfileAtom);
	const [value, setValue] = useState(fieldElem);

	const { mutate: changeCabinet } = useMutation({
		mutationKey: ["changeFieldCabinet"],
		mutationFn: (data: IPutField) =>
			cabinetService.putCabinets(data, dataProfile!.api_key),
		onSuccess: () => {
			toast.success("Кабинет успешно изменен");
			reset();
			location.reload();
		},
		onError: (error: any) => {
			toast.error(error.response.data.message);
		},
	});

	const { mutate: changeGroup } = useMutation({
		mutationKey: ["changeFieldGroup"],
		mutationFn: (data: IPutField) =>
			groupService.changeGroups(data, dataProfile!.api_key),
		onSuccess: () => {
			toast.success("Группа успешно изменена");
			reset();
			location.reload();
		},
		onError: (error: any) => {
			toast.error(error.response.data.message);
		},
	});

	const { mutate: changeTeacher } = useMutation({
		mutationKey: ["changeFieldTeacher"],
		mutationFn: (data: IPutField) =>
			teachersService.changeTeachers(data, dataProfile!.api_key),
		onSuccess: () => {
			toast.success("Преподаватель успешно изменен");
			reset();
			location.reload();
		},
		onError: (error: any) => {
			toast.error(error.response.data.message);
		},
	});

	const onSubmit: SubmitHandler<IPutField> = data => {
		const { newName } = data;

		const result: IPutField = {
			newName: String(newName),
			oldName: fieldElem,
		};

		if (field === "CABINETS") {
			changeCabinet(result);
		} else if (field === "GROUP") {
			changeGroup(result);
		} else if (field === "TEACHERS") {
			changeTeacher(result);
		}
	};
	return (
		<form
			className='w-full flex items-center justify-center mb-2'
			onSubmit={handleSubmit(onSubmit)}
		>
			<input
				type='text'
				value={value}
				{...register("newName")}
				className='w-7/12 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
				placeholder='Введите значение'
				onChange={event => setValue(event.target.value)}
			/>

			<ButtonSubmit title={"Изменить"} icon={<PenLine />} className='w-5/12' />
		</form>
	);
};
