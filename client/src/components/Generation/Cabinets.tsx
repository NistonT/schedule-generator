"use client";
import { messageCabinets } from "@/constants/messageToast.constants";
import { useHandleAddCommon } from "@/hook/useHandleAddCommon";
import { cabinetsAtom, currentScheduleAtom } from "@/jotai/schedule";
import { ISchedule } from "@/types/schedule.type";
import { useAtom, useAtomValue } from "jotai";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { ButtonGeneration } from "../ui/buttons/ButtonGeneration";
import { FieldGeneration } from "../ui/fields/FieldGeneration";

export const Cabinets = () => {
	const [cabinets, setCabinets] = useAtom<string[]>(cabinetsAtom);
	const currentSchedule = useAtomValue<ISchedule | null>(currentScheduleAtom);

	// Локальное состояние
	const [isExpanded, setIsExpanded] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		if (currentSchedule) {
			setCabinets(currentSchedule.cabinets);
		}
	}, [currentSchedule]);

	// Фильтруем кабинеты по поисковому запросу
	const filteredCabinets = cabinets.filter(cabinet =>
		cabinet.toLowerCase().includes(searchTerm.trim().toLowerCase())
	);

	const limit = isExpanded ? filteredCabinets.length : 5;

	const { handleAdd, handleRemove, inputValue, setInputValue } =
		useHandleAddCommon(cabinets, setCabinets, messageCabinets);

	return (
		<div className='space-y-4'>
			{/* Поиск */}
			<div className='relative w-full sm:w-1/2'>
				<Search className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
				<input
					type='text'
					placeholder='Поиск по кабинетам...'
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
					className='pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand'
				/>
			</div>

			{/* Список кабинетов */}
			<div className='mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50'>
				<h3 className='font-semibold text-gray-700 mb-2'>Кабинеты</h3>

				{filteredCabinets.length === 0 ? (
					<p className='text-sm text-gray-500'>
						{searchTerm ? "Ничего не найдено" : "Нет кабинетов"}
					</p>
				) : (
					<>
						{/* Кнопка Показать все / Скрыть */}
						{filteredCabinets.length > 5 && (
							<button
								type='button'
								onClick={() => setIsExpanded(!isExpanded)}
								className='mt-2 text-xs text-brand hover:underline'
							>
								{isExpanded
									? "Скрыть"
									: `Показать все (${filteredCabinets.length})`}
							</button>
						)}

						{/* Отображаем отфильтрованные кабинеты */}
						<div className='flex flex-wrap gap-2 mt-2'>
							{filteredCabinets.slice(0, limit).map((cabinet, index) => (
								<div
									key={index}
									onClick={() => handleRemove(cabinet)}
									className='cursor-pointer px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-800 hover:bg-gray-100 transition'
								>
									{cabinet}
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
					label={"Кабинеты"}
					name={"cabinets"}
					value={inputValue}
					onChange={event => setInputValue(event.target.value)}
				/>
				<ButtonGeneration title={"Добавить"} />
			</form>
		</div>
	);
};
