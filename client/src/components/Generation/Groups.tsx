"use client";
import { messageGroups } from "@/constants/messageToast.constants";
import { useHandleAddCommon } from "@/hook/useHandleAddCommon";
import { currentScheduleAtom, groupsAtom } from "@/jotai/schedule";
import { IScheduleGetList } from "@/types/schedule.types";
import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import { ButtonGeneration } from "../ui/buttons/ButtonGeneration";
import { FieldGeneration } from "../ui/fields/FieldGeneration";

export const Groups = () => {
	const [groups, setGroups] = useAtom<string[]>(groupsAtom);
	const currentSchedule = useAtomValue<IScheduleGetList | null>(
		currentScheduleAtom
	);

	const { handleAdd, handleRemove, inputValue, setInputValue } =
		useHandleAddCommon(groups, setGroups, messageGroups);

	useEffect(() => {
		if (currentSchedule) {
			setGroups(currentSchedule.groups);
		}
	}, [currentSchedule]);

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
					onChange={event => setInputValue(event.target.value)}
				/>
				<ButtonGeneration title={"Добавить"} />
			</form>
		</>
	);
};
