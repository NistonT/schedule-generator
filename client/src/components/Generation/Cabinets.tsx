"use client";
import { cabinetsAtom } from "@/jotai/schedule";
import { useAtom } from "jotai";
import { useState } from "react";
import { toast } from "sonner";
import { ButtonGeneration } from "../ui/buttons/ButtonGeneration";
import { FieldGeneration } from "../ui/fields/FieldGeneration";

export const Cabinets = () => {
	const [cabinets, setCabinets] = useAtom<string[]>(cabinetsAtom);

	const [inputValue, setInputValue] = useState("");

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	const handleAddCabinet = () => {
		const trimmedValue = inputValue.trim();

		if (trimmedValue) {
			if (cabinets.includes(trimmedValue)) {
				toast.error("Кабинет уже добавлен!");
			} else {
				setCabinets(prev => [...prev, trimmedValue]);
				setInputValue("");
				toast.success("Кабинет добавлен!");
			}
		}
	};

	const handleRemoveCabinet = (cabinet: string) => {
		setCabinets(prev => prev.filter(c => c !== cabinet));
		toast.success(`Кабинет "${cabinet}" удален!`);
	};

	return (
		<>
			<div className='mb-4 p-4 border rounded-lg flex gap-1'>
				{cabinets.map((cabinet, index) => (
					<div
						key={index}
						onClick={() => handleRemoveCabinet(cabinet)}
						className='mb-2 cursor-pointer'
					>
						{cabinet}
					</div>
				))}
			</div>
			<form
				onSubmit={e => {
					e.preventDefault();
					handleAddCabinet();
				}}
			>
				<FieldGeneration
					label={"Кабинеты"}
					name={"cabinets"}
					value={inputValue}
					onChange={handleInputChange}
				/>
				<ButtonGeneration title={"Добавить"} />
			</form>
		</>
	);
};
