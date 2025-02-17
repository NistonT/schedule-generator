"use client";
import { groupsAtom } from "@/jotai/schedule";
import { useAtom } from "jotai";
import { useState } from "react";
import { toast } from "sonner";
import { ButtonGeneration } from "../ui/buttons/ButtonGeneration";
import { FieldGeneration } from "../ui/fields/FieldGeneration";

export const Groups = () => {
	const [groups, setGroups] = useAtom<string[]>(groupsAtom);
	const [inputValue, setInputValue] = useState("");

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	const handleAdd = () => {
		const trimmedValue = inputValue.trim();

		if (trimmedValue) {
			if (groups.includes(trimmedValue)) {
				toast.error("Группа уже добавлена!");
			} else {
				setGroups(prev => [...prev, trimmedValue]);
				setInputValue("");
				toast.success("Группа добавлена!");
			}
		}
	};

	const handleRemove = (field: string) => {
		setGroups(prev => prev.filter(f => f !== field));
		toast.success(`Группа "${field}" удалена!`);
	};

	return (
		<>
			<div className='mb-4 p-4 border rounded-lg flex gap-1'>
				{groups.map((group, index) => (
					<div
						key={index}
						onClick={() => handleRemove(group)}
						className='mb-2 cursor-pointer'
					>
						{group}
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
					label={"Группы"}
					name={"groups"}
					value={inputValue}
					onChange={handleInputChange}
				/>
				<ButtonGeneration title={"Добавить"} />
			</form>
		</>
	);
};
