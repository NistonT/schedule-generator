"use client";

import { dataProfileAtom } from "@/jotai/generation";
import { cabinetService } from "@/services/cabinets.service";
import { IUser } from "@/types/auth.types";
import { IPutField } from "@/types/generation.types";
import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { PenLine } from "lucide-react";
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
	const [dataProfile, setDataProfile] = useAtom<IUser | null>(dataProfileAtom);

	const { mutate: changeCabinet } = useMutation({
		mutationKey: ["changeFieldCabinet"],
		mutationFn: (data: IPutField) =>
			cabinetService.putCabinets(data, dataProfile!.api_key),
		onSuccess: () => {
			toast.success("Кабинет успешно изменен");
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
			console.log(result);
			changeCabinet(result);
		}
	};
	return (
		<form
			className='w-full flex items-center justify-center mb-2'
			onSubmit={handleSubmit(onSubmit)}
		>
			<input
				type='text'
				{...register("newName")}
				className='w-7/12 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
				placeholder='Введите значение'
			/>

			<ButtonSubmit title={"Изменить"} icon={<PenLine />} className='w-5/12' />
		</form>
	);
};
