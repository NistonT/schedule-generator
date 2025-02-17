"use client";
import {
	cabinetLimitsAtom,
	cabinetsAtom,
	teachersAtom,
} from "@/jotai/schedule";
import { TypeCabinetLimits, TypeTeachers } from "@/types/schedule.types";
import { useAtom } from "jotai";
import { useState } from "react";
import { toast } from "sonner";
import { ButtonGeneration } from "../ui/buttons/ButtonGeneration";

export const CabinetLimits = () => {
	const [cabinetLimits, setCabinetLimits] =
		useAtom<TypeCabinetLimits[]>(cabinetLimitsAtom);
	const [teachers, setTeachers] = useAtom<TypeTeachers[]>(teachersAtom);
	const [cabinets, setCabinets] = useAtom<string[]>(cabinetsAtom);

	const [selectedTeacher, setSelectedTeacher] = useState<number | "">("");
	const [selectedCabinets, setSelectedCabinets] = useState<string[]>([]);

	// Функция для получения имени преподавателя по tid
	const getTeacherName = (tid: number): string => {
		const teacher = teachers.find(teacher => teacher.tid === tid);
		return teacher ? teacher.name : "Неизвестный преподаватель";
	};

	// Обработчик изменения выбранного преподавателя
	const handleTeacherChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedTeacher(parseInt(e.target.value, 10));
	};

	// Обработчик изменения выбранных кабинетов
	const handleCabinetsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedOptions = Array.from(e.target.selectedOptions).map(
			option => option.value
		);
		setSelectedCabinets(selectedOptions);
	};

	// Добавление записи в cabinetLimits
	const handleAddCabinetLimit = () => {
		if (selectedTeacher !== "" && selectedCabinets.length > 0) {
			// Проверяем, есть ли уже запись для этого преподавателя
			const existingRecordIndex = cabinetLimits.findIndex(
				item => item.tid === selectedTeacher
			);

			if (existingRecordIndex !== -1) {
				// Если запись уже существует, обновляем её
				const updatedRecord = {
					...cabinetLimits[existingRecordIndex],
					cabinets: [
						...cabinetLimits[existingRecordIndex].cabinets,
						...selectedCabinets.filter(
							cabinet =>
								!cabinetLimits[existingRecordIndex].cabinets.includes(cabinet)
						),
					],
				};
				setCabinetLimits(prev => [
					...prev.slice(0, existingRecordIndex),
					updatedRecord,
					...prev.slice(existingRecordIndex + 1),
				]);
				toast.success("Кабинеты добавлены к существующей записи!");
			} else {
				// Если записи нет, создаем новую
				const newRecord: TypeCabinetLimits = {
					tid: selectedTeacher,
					cabinets: selectedCabinets,
				};
				setCabinetLimits(prev => [...prev, newRecord]);
				toast.success("Новая запись добавлена!");
			}
		} else {
			toast.error("Выберите преподавателя и хотя бы один кабинет!");
		}
	};

	// Удаление записи из cabinetLimits
	const handleRemoveCabinetLimit = (tid: number) => {
		if (window.confirm("Вы уверены, что хотите удалить эту запись?")) {
			setCabinetLimits(prev => prev.filter(item => item.tid !== tid));
			toast.success("Запись удалена!");
		}
	};

	return (
		<>
			<div className='mb-4 p-4 border rounded-lg flex flex-wrap gap-2'>
				{cabinetLimits.map(record => (
					<div
						key={record.tid}
						className='px-3 py-1 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300 transition-colors'
						onClick={() => handleRemoveCabinetLimit(record.tid)}
					>
						{`Преподаватель: ${getTeacherName(
							record.tid
						)}, Кабинеты: ${record.cabinets.join(", ")}`}
					</div>
				))}
			</div>
			<form
				onSubmit={e => {
					e.preventDefault();
					handleAddCabinetLimit();
				}}
			>
				<div className='mb-4'>
					<label
						htmlFor='teacher-select'
						className='block text-sm font-medium text-gray-700'
					>
						Выберите преподавателя
					</label>
					<select
						id='teacher-select'
						value={selectedTeacher}
						onChange={handleTeacherChange}
						className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
					>
						<option value=''>Выберите преподавателя</option>
						{teachers.map(teacher => (
							<option key={teacher.tid} value={teacher.tid}>
								{teacher.name}
							</option>
						))}
					</select>
				</div>
				<div className='mb-4'>
					<label
						htmlFor='cabinets-select'
						className='block text-sm font-medium text-gray-700'
					>
						Выберите кабинеты
					</label>
					<select
						id='cabinets-select'
						multiple
						value={selectedCabinets}
						onChange={handleCabinetsChange}
						className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
					>
						{cabinets.map(cabinet => (
							<option key={cabinet} value={cabinet}>
								{cabinet}
							</option>
						))}
					</select>
				</div>
				<ButtonGeneration title={"Добавить"} />
			</form>
		</>
	);
};
