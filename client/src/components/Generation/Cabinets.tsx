"use client";
import { messageCabinets } from "@/constants/messageToast.constants";
import { useHandleAddCommon } from "@/hook/useHandleAddCommon";
import { cabinetsAtom, currentScheduleAtom } from "@/jotai/schedule";
import { IScheduleGetList } from "@/types/schedule.types";
import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import { ButtonGeneration } from "../ui/buttons/ButtonGeneration";
import { FieldGeneration } from "../ui/fields/FieldGeneration";

export const Cabinets = () => {
	const [cabinets, setCabinets] = useAtom<string[]>(cabinetsAtom);
	const currentSchedule = useAtomValue<IScheduleGetList | null>(
		currentScheduleAtom
	);

	useEffect(() => {
		if (currentSchedule) {
			setCabinets(currentSchedule.cabinets);
		}
	}, [currentSchedule]);

	const { handleAdd, handleRemove, inputValue, setInputValue } =
		useHandleAddCommon(cabinets, setCabinets, messageCabinets);

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
