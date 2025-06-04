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
import { Search } from "lucide-react";
import { m } from "motion/react";
import { useEffect, useState } from "react";
import { ButtonGeneration } from "../ui/buttons/ButtonGeneration";
import { FieldGeneration } from "../ui/fields/FieldGeneration";

export const Teachers = () => {
	const [teachers, setTeachers] = useAtom<TypeTeachers[]>(teachersAtom);
	const currentSchedule = useAtomValue<ISchedule | null>(currentScheduleAtom);
	const [countTeachers, setCountTeachers] = useAtom<number>(countTeacherAtom);

	const [searchTerm, setSearchTerm] = useState("");
	const [isExpanded, setIsExpanded] = useState(false);

	const limit = isExpanded ? teachers.length : 5;

	const filteredTeachers = teachers.filter(teacher =>
		teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const { handleAdd, handleRemove, inputValue, setInputValue } =
		useHandleAddObject(
			teachers,
			setTeachers,
			countTeachers,
			setCountTeachers,
			messageTeachers
		);

	// Обновляем список при изменении расписания
	useEffect(() => {
		if (currentSchedule) {
			setTeachers(currentSchedule.teachers || []);
		}
	}, [currentSchedule]);

	return (
		<div className='space-y-6'>
			{/* Поле поиска */}
			<div className='relative w-full sm:w-1/2'>
				<Search className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
				<input
					type='text'
					placeholder='Поиск по преподавателям...'
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
					className='pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand'
				/>
			</div>

			{/* Список преподавателей */}
			<div className='mb-4 p-4 border border-gray-200 rounded-lg bg-white shadow-sm'>
				<h3 className='font-semibold text-gray-700 mb-2'>Преподаватели</h3>

				{filteredTeachers.length === 0 ? (
					<p className='text-sm text-gray-500'>
						{searchTerm ? "Ничего не найдено" : "Нет преподавателей"}
					</p>
				) : (
					<>
						{/* Кнопка Показать все / Скрыть */}
						{filteredTeachers.length > 5 && (
							<button
								type='button'
								onClick={() => setIsExpanded(!isExpanded)}
								className='mt-2 text-xs text-brand hover:underline'
							>
								{isExpanded
									? "Скрыть"
									: `Показать все (${filteredTeachers.length})`}
							</button>
						)}
						<div className='flex flex-wrap gap-2 mt-2'>
							{filteredTeachers.slice(0, limit).map(teacher => (
								<m.div
									key={teacher.tid}
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.9 }}
									transition={{ duration: 0.2 }}
									onClick={() => handleRemove(teacher)}
									className='px-3 py-1 bg-gray-50 hover:bg-blue-100 border rounded-full cursor-pointer text-sm text-gray-950 transition-colors'
								>
									{teacher.name}
								</m.div>
							))}
						</div>
					</>
				)}
			</div>

			{/* Форма добавления */}
			<form
				onSubmit={e => {
					e.preventDefault();
					handleAdd();
				}}
				className='space-y-4'
			>
				<FieldGeneration
					label='Добавить преподавателя'
					name='teachers'
					value={inputValue}
					onChange={event => setInputValue(event.target.value)}
				/>
				<ButtonGeneration title='Добавить' />
			</form>
		</div>
	);
};
