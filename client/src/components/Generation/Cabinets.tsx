"use client";
import { messageCabinets } from "@/constants/messageToast.constants";
import { useHandleAddCommon } from "@/hook/useHandleAddCommon";
import { dataProfileAtom } from "@/jotai/generation";
import { cabinetsAtom } from "@/jotai/schedule";
import { cabinetService } from "@/services/cabinets.service";
import { IUser } from "@/types/auth.types";
import { useQuery } from "@tanstack/react-query";
import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import { ButtonGeneration } from "../ui/buttons/ButtonGeneration";
import { FieldGeneration } from "../ui/fields/FieldGeneration";

export const Cabinets = () => {
	const [cabinets, setCabinets] = useAtom<string[]>(cabinetsAtom);

	const dataProfile = useAtomValue<IUser | null>(dataProfileAtom);
	const { handleAdd, handleRemove, inputValue, setInputValue } =
		useHandleAddCommon(cabinets, setCabinets, messageCabinets);

	const { data, isLoading } = useQuery({
		queryKey: ["getCabinets"],
		queryFn: () => cabinetService.getCabinets(dataProfile!.api_key),
		select: data => data.data[0].cabinets,
	});

	useEffect(() => {
		if (!isLoading && data) {
			setCabinets(data);
		}
	}, [isLoading, data, setCabinets]);

	return (
		<>
			<div className='mb-4 p-4 border rounded-lg flex gap-1'>
				{cabinets.map((cabinet, index) => (
					<div
						key={index}
						onClick={() => handleRemove(cabinet)}
						className='mb-2 cursor-pointer'
					>
						{cabinet}
					</div>
				))}
			</div>
			<form
				onSubmit={e => {
					e.preventDefault();
					handleAdd();
				}}
			>
				<FieldGeneration
					label={"Кабинеты"}
					name={"cabinets"}
					value={inputValue}
					onChange={event => setInputValue(event.target.value)}
				/>
				<ButtonGeneration title={"Добавить"} />
			</form>
		</>
	);
};
