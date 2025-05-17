"use client";
import { messageTeachers } from "@/constants/messageToast.constants";
import { useHandleAddObject } from "@/hook/useHandleAddObject";
import {
	countTeacherAtom,
	currentScheduleAtom,
	teachersAtom,
} from "@/jotai/schedule";
import { ISchedule, TypeTeachers } from "@/types/schedule.type";
import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import { ButtonGeneration } from "../ui/buttons/ButtonGeneration";
import { FieldGeneration } from "../ui/fields/FieldGeneration";

export const Teachers = () => {
	const [teachers, setTeachers] = useAtom<TypeTeachers[]>(teachersAtom);
	const currentSchedule = useAtomValue<ISchedule | null>(currentScheduleAtom);

	const [countTeachers, setCountTeachers] = useAtom<number>(countTeacherAtom);
	const { handleAdd, handleRemove, inputValue, setInputValue } =
		useHandleAddObject(
			teachers,
			setTeachers,
			countTeachers,
			setCountTeachers,
			messageTeachers
		);

	useEffect(() => {
		if (currentSchedule) {
			setTeachers(currentSchedule.teachers);
		}
	}, [currentSchedule]);

	return (
		<>
			<div className='mb-4 p-4 border rounded-lg flex flex-wrap gap-2'>
				{teachers?.map(teacher => (
					<div
						key={teacher.tid}
						onClick={() => handleRemove(teacher)}
						className='px-3 py-1 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300 transition-colors'
					>
						{teacher.name}
					</div>
				)) ?? ""}
			</div>
			<form
				onSubmit={e => {
					e.preventDefault();
					handleAdd();
				}}
			>
				<FieldGeneration
					label={"Преподаватели"}
					name={"teachers"}
					value={inputValue}
					onChange={event => setInputValue(event.target.value)}
				/>
				<ButtonGeneration title={"Добавить"} />
			</form>
		</>
	);
};
