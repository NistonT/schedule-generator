"use client";
import {
	cabinetLimitsAtom,
	cabinetsAtom,
	teachersAtom,
} from "@/jotai/schedule";
import { TypeCabinetLimits, TypeTeachers } from "@/types/schedule.type";
import { useAtom } from "jotai";
import { ChevronsDown, ChevronsUp, Search, X } from "lucide-react";
import { m } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { ButtonGeneration } from "../ui/buttons/ButtonGeneration";

export const CabinetLimits = () => {
	const [cabinetLimits, setCabinetLimits] =
		useAtom<TypeCabinetLimits[]>(cabinetLimitsAtom);
	const [teachers] = useAtom<TypeTeachers[]>(teachersAtom);
	const [cabinets] = useAtom<string[]>(cabinetsAtom);

	const [selectedTeacher, setSelectedTeacher] = useState<number | "">("");
	const [selectedCabinets, setSelectedCabinets] = useState<string[]>([]);
	const [showAll, setShowAll] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

	// Фильтрация записей по имени преподавателя или номеру кабинета
	const filteredLimits = cabinetLimits.filter(record => {
		const teacherName =
			teachers.find(t => t.tid === record.tid)?.name?.toLowerCase() || "";
		const cabinetsStr = record.cabinets.join(", ").toLowerCase();
		const term = searchTerm.toLowerCase();

		return teacherName.includes(term) || cabinetsStr.includes(term);
	});

	const displayedLimits = showAll ? filteredLimits : filteredLimits.slice(0, 3);

	const getTeacherName = (tid: number): string => {
		const teacher = teachers?.find(teacher => teacher.tid === tid);
		return teacher ? teacher.name : "Неизвестный преподаватель";
	};

	const handleTeacherChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedTeacher(parseInt(e.target.value, 10));
	};

	const handleCabinetsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedOptions = Array.from(e.target.selectedOptions).map(
			option => option.value
		);
		setSelectedCabinets(selectedOptions);
	};

	const handleAddCabinetLimit = () => {
		if (selectedTeacher !== "" && selectedCabinets.length > 0) {
			const existingRecordIndex = cabinetLimits.findIndex(
				item => item.tid === selectedTeacher
			);

			if (existingRecordIndex !== -1) {
				const updatedRecord = {
					...cabinetLimits[existingRecordIndex],
					cabinets: Array.from(
						new Set([
							...cabinetLimits[existingRecordIndex].cabinets,
							...selectedCabinets,
						])
					),
				};
				setCabinetLimits([
					...cabinetLimits.slice(0, existingRecordIndex),
					updatedRecord,
					...cabinetLimits.slice(existingRecordIndex + 1),
				]);
				toast.success("Кабинеты добавлены к существующей записи!");
			} else {
				const newRecord: TypeCabinetLimits = {
					tid: selectedTeacher,
					cabinets: Array.from(new Set(selectedCabinets)),
				};
				setCabinetLimits([...cabinetLimits, newRecord]);
				toast.success("Новая запись добавлена!");
			}
		} else {
			toast.error("Выберите преподавателя и хотя бы один кабинет!");
		}
	};

	const handleRemoveCabinetLimit = (tid: number) => {
		if (window.confirm("Вы уверены, что хотите удалить эту запись?")) {
			setCabinetLimits(cabinetLimits.filter(item => item.tid !== tid));
			toast.success("Запись удалена!");
		}
	};

	return (
		<m.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			className='bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700'
		>
			<h2 className='text-lg font-semibold mb-4 text-gray-800 dark:text-white'>
				Ограничения по кабинетам
			</h2>

			{/* Панель поиска */}
			<div className='mb-6'>
				<div className='flex items-center gap-2 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg shadow-sm'>
					<Search className='w-5 h-5 text-gray-500 dark:text-gray-400' />
					<input
						type='text'
						placeholder='Поиск по преподавателю или кабинету'
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
						className='w-full bg-transparent outline-none text-gray-800 dark:text-white placeholder:text-gray-400'
					/>
				</div>
			</div>

			{/* Список текущих ограничений */}
			<div className='mb-6'>
				{/* Кнопка показать всё / скрыть */}
				{filteredLimits.length > 3 && (
					<button
						type='button'
						onClick={() => setShowAll(!showAll)}
						className='mt-3 flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none'
					>
						{showAll ? (
							<>
								<ChevronsUp className='w-4 h-4' /> Скрыть
							</>
						) : (
							<>
								<ChevronsDown className='w-4 h-4' /> Показать все
							</>
						)}
					</button>
				)}
				<div className='flex flex-wrap gap-2'>
					{displayedLimits.length > 0 ? (
						displayedLimits.map(record => (
							<m.div
								key={record.tid}
								initial={{ scale: 0.95, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.9, opacity: 0 }}
								className='px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full flex items-center gap-1 group cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors'
								onClick={() => handleRemoveCabinetLimit(record.tid)}
							>
								<span>
									Преподаватель: {getTeacherName(record.tid)}, Кабинеты:{" "}
									{record.cabinets.join(", ")}
								</span>
								<X className='w-4 h-4 opacity-70 group-hover:opacity-100' />
							</m.div>
						))
					) : (
						<p className='text-sm text-gray-500 dark:text-gray-400 italic'>
							{searchTerm ? "Ничего не найдено" : "Нет добавленных ограничений"}
						</p>
					)}
				</div>
			</div>

			{/* Форма добавления */}
			<form
				onSubmit={e => {
					e.preventDefault();
					handleAddCabinetLimit();
				}}
				className='space-y-4'
			>
				{/* Выбор преподавателя */}
				<div>
					<label
						htmlFor='teacher-select'
						className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
					>
						Выберите преподавателя
					</label>
					<select
						id='teacher-select'
						value={selectedTeacher}
						onChange={handleTeacherChange}
						className='w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors'
					>
						<option value=''>Выберите преподавателя</option>
						{teachers?.map(teacher => (
							<option key={teacher.tid} value={teacher.tid}>
								{teacher.name}
							</option>
						)) ?? ""}
					</select>
				</div>

				{/* Выбор кабинетов */}
				<div>
					<label
						htmlFor='cabinets-select'
						className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
					>
						Выберите кабинеты
					</label>
					<select
						id='cabinets-select'
						multiple
						value={selectedCabinets}
						onChange={handleCabinetsChange}
						className='w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors'
					>
						{cabinets.map(cabinet => (
							<option key={cabinet} value={cabinet}>
								{cabinet}
							</option>
						))}
					</select>
				</div>

				{/* Кнопка добавления */}
				<div className='pt-2'>
					<ButtonGeneration title='Добавить' />
				</div>
			</form>
		</m.div>
	);
};
