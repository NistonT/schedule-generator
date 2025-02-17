"use client";
import { countTeacherAtom, teachersAtom } from "@/jotai/schedule";
import { TypeTeachers } from "@/types/schedule.types";
import { useAtom } from "jotai";
import { useState } from "react";
import { toast } from "sonner";
import { ButtonGeneration } from "../ui/buttons/ButtonGeneration";
import { FieldGeneration } from "../ui/fields/FieldGeneration";

export const Teachers = () => {
	const [teachers, setTeachers] = useAtom<TypeTeachers[]>(teachersAtom);
	const [inputValue, setInputValue] = useState("");
	const [countTeachers, setCountTeachers] = useAtom<number>(countTeacherAtom);
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	const handleAddTeacher = () => {
		const trimmedValue = inputValue.trim();
		setCountTeachers(countTeachers + 1);

		if (trimmedValue) {
			const isDuplicate = teachers.some(
				teacher => teacher.name === trimmedValue
			);
			if (isDuplicate) {
				toast.error("Преподаватель уже добавлен!");
			} else {
				const newTeacher: TypeTeachers = {
					tid: countTeachers,
					name: trimmedValue,
				};
				console.log(newTeacher);
				setTeachers(prev => [...prev, newTeacher]);
				setInputValue("");
				toast.success("Преподаватель добавлен!");
			}
		}
	};

	const handleRemoveTeacher = (teacher: TypeTeachers) => {
		setTeachers(prev => prev.filter(t => t.tid !== teacher.tid)); // Удаляем по ID
		toast.success(`Преподаватель "${teacher.name}" удален!`);
	};

	return (
		<>
			<div className='mb-4 p-4 border rounded-lg flex flex-wrap gap-2'>
				{teachers.map(teacher => (
					<div
						key={teacher.tid}
						onClick={() => handleRemoveTeacher(teacher)}
						className='px-3 py-1 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300 transition-colors'
					>
						{teacher.name}
					</div>
				))}
			</div>
			<form
				onSubmit={e => {
					e.preventDefault();
					handleAddTeacher();
				}}
			>
				<FieldGeneration
					label={"Преподаватели"}
					name={"teachers"}
					value={inputValue}
					onChange={handleInputChange}
				/>
				<ButtonGeneration title={"Добавить"} />
			</form>
		</>
	);
};
