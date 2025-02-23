"use client";
import { messageGroups } from "@/constants/messageToast.constants";
import { useHandleAddCommon } from "@/hook/useHandleAddCommon";
import { groupsAtom } from "@/jotai/schedule";
import { useAtom } from "jotai";
import { ButtonGeneration } from "../ui/buttons/ButtonGeneration";
import { FieldGeneration } from "../ui/fields/FieldGeneration";

export const Groups = () => {
	const [groups, setGroups] = useAtom<string[]>(groupsAtom);
	const { handleAdd, handleRemove, inputValue, setInputValue } =
		useHandleAddCommon(groups, setGroups, messageGroups);

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
