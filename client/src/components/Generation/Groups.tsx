"use client";
import { messageGroups } from "@/constants/messageToast.constants";
import { useHandleAddCommon } from "@/hook/useHandleAddCommon";
import { currentScheduleAtom, groupsAtom } from "@/jotai/schedule";
import { ISchedule } from "@/types/schedule.type";
import { useAtom, useAtomValue } from "jotai";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { ButtonGeneration } from "../ui/buttons/ButtonGeneration";
import { FieldGeneration } from "../ui/fields/FieldGeneration";

export const Groups = () => {
	const [groups, setGroups] = useAtom<string[]>(groupsAtom);
	const currentSchedule = useAtomValue<ISchedule | null>(currentScheduleAtom);

	// Локальное состояние для управления отображением
	const [isExpanded, setIsExpanded] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		if (currentSchedule) {
			setGroups(currentSchedule.groups);
		}
	}, [currentSchedule]);

	// Фильтруем группы по поисковому запросу
	const filteredGroups = groups.filter(group =>
		group.toLowerCase().includes(searchTerm.trim().toLowerCase())
	);

	const limit = isExpanded ? filteredGroups.length : 5;

	const { handleAdd, handleRemove, inputValue, setInputValue } =
		useHandleAddCommon(groups, setGroups, messageGroups);

	return (
		<div className='space-y-4'>
			{/* Поле поиска */}
			<div className='relative w-full sm:w-1/2'>
				<Search className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
				<input
					type='text'
					placeholder='Поиск по группам...'
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
					className='pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand'
				/>
			</div>

			{/* Список групп */}
			<div className='mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50'>
				<h3 className='font-semibold text-gray-700 mb-2'>Группы</h3>

				{filteredGroups.length === 0 ? (
					<p className='text-sm text-gray-500'>
						{searchTerm ? "Ничего не найдено" : "Нет групп"}
					</p>
				) : (
					<>
						{/* Кнопка Показать все / Скрыть */}
						{filteredGroups.length > 5 && (
							<button
								type='button'
								onClick={() => setIsExpanded(!isExpanded)}
								className='mt-2 text-xs text-brand hover:underline'
							>
								{isExpanded
									? "Скрыть"
									: `Показать все (${filteredGroups.length})`}
							</button>
						)}

						{/* Отображаем отфильтрованные группы */}
						<div className='flex flex-wrap gap-2 mt-2'>
							{filteredGroups.slice(0, limit).map((group, index) => (
								<div
									key={index}
									onClick={() => handleRemove(group)}
									className='cursor-pointer px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-800 hover:bg-gray-100 transition'
								>
									{group}
								</div>
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
					label={"Группы"}
					name={"groups"}
					value={inputValue}
					onChange={event => setInputValue(event.target.value)}
				/>
				<ButtonGeneration title={"Добавить"} />
			</form>
		</div>
	);
};
