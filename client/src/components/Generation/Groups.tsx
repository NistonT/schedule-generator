"use client";
import { messageGroups } from "@/constants/messageToast.constants";
import { useHandleAddCommon } from "@/hook/useHandleAddCommon";
import { dataProfileAtom } from "@/jotai/generation";
import { groupsAtom } from "@/jotai/schedule";
import { groupService } from "@/services/groups.service";
import { IUser } from "@/types/auth.types";
import { useQuery } from "@tanstack/react-query";
import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import { ButtonGeneration } from "../ui/buttons/ButtonGeneration";
import { FieldGeneration } from "../ui/fields/FieldGeneration";

export const Groups = () => {
	const [groups, setGroups] = useAtom<string[]>(groupsAtom);

	const dataProfile = useAtomValue<IUser | null>(dataProfileAtom);
	const { handleAdd, handleRemove, inputValue, setInputValue } =
		useHandleAddCommon(groups, setGroups, messageGroups);

	const { data, isLoading } = useQuery({
		queryKey: ["getGroups"],
		queryFn: () => groupService.getGroups(dataProfile!.api_key),
		select: data => data.data[0].groups,
	});

	useEffect(() => {
		if (!isLoading && data) {
			setGroups(data);
		}
	}, [data, isLoading, setGroups]);

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
