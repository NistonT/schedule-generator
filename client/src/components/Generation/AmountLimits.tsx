"use client";
import {
	amountLimitsAtom,
	groupsAtom,
	subjectsMapAtom,
} from "@/jotai/schedule";
import { TypeAmountLimits } from "@/types/schedule.types";
import { useAtom } from "jotai";
import { useState } from "react";
import { toast } from "sonner";
import { ButtonGeneration } from "../ui/buttons/ButtonGeneration";

export const AmountLimits = () => {
	const [amountLimits, setAmountLimits] =
		useAtom<TypeAmountLimits[]>(amountLimitsAtom);
	const [groups, setGroups] = useAtom<string[]>(groupsAtom);
	const [subjectsMap, setSubjectsMap] =
		useAtom<Record<string, string[]>>(subjectsMapAtom);

	const [selectedGroup, setSelectedGroup] = useState("");
	const [selectedSubject, setSelectedSubject] = useState("");
	const [amount, setAmount] = useState<number>(0);
	const [lessonType, setLessonType] = useState<"L" | "1" | "2">("L");

	// Обработчик изменения выбранной группы
	const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedGroup(e.target.value);
		setSelectedSubject(""); // Сбрасываем выбранный предмет при изменении группы
	};

	// Обработчик изменения выбранного предмета
	const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedSubject(e.target.value);
	};

	// Обработчик изменения количества
	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value, 10);
		setAmount(isNaN(value) ? 0 : value); // Устанавливаем 0, если ввод не является числом
	};

	// Обработчик изменения типа занятия
	const handleLessonTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setLessonType(e.target.value as "L" | "1" | "2");
	};

	// Добавление записи в amountLimits
	const handleAddAmountLimit = () => {
		if (selectedGroup && selectedSubject && amount > 0) {
			// Проверяем, есть ли уже такая запись
			const isDuplicate = amountLimits.some(
				item =>
					item.group === selectedGroup &&
					item.subject === selectedSubject &&
					item.lessonType === lessonType
			);
			if (isDuplicate) {
				toast.error("Такая запись уже существует!");
			} else {
				// Создаем новую запись
				const newRecord: TypeAmountLimits = {
					group: selectedGroup,
					subject: selectedSubject,
					amount: amount,
					lessonType: lessonType,
				};
				setAmountLimits(prev => [...prev, newRecord]);
				toast.success("Запись добавлена!");
			}
		} else {
			toast.error("Заполните все поля корректно!");
		}
	};

	// Удаление записи из amountLimits
	const handleRemoveAmountLimit = (index: number) => {
		if (window.confirm("Вы уверены, что хотите удалить эту запись?")) {
			setAmountLimits(prev => prev.filter((_, i) => i !== index));
			toast.success("Запись удалена!");
		}
	};

	return (
		<>
			<div className='mb-4 p-4 border rounded-lg flex flex-wrap gap-2'>
				{amountLimits.map((record, index) => (
					<div
						key={index}
						className='px-3 py-1 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300 transition-colors'
						onClick={() => handleRemoveAmountLimit(index)}
					>
						{`Группа: ${record.group}, Предмет: ${record.subject}, Количество: ${record.amount}, Тип: ${record.lessonType}`}
					</div>
				))}
			</div>
			<form
				onSubmit={e => {
					e.preventDefault();
					handleAddAmountLimit();
				}}
			>
				<div className='mb-4'>
					<label
						htmlFor='group-select'
						className='block text-sm font-medium text-gray-700'
					>
						Выберите группу
					</label>
					<select
						id='group-select'
						value={selectedGroup}
						onChange={handleGroupChange}
						className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
					>
						<option value=''>Выберите группу</option>
						{groups.map(group => (
							<option key={group} value={group}>
								{group}
							</option>
						))}
					</select>
				</div>
				<div className='mb-4'>
					<label
						htmlFor='subject-select'
						className='block text-sm font-medium text-gray-700'
					>
						Выберите предмет
					</label>
					<select
						id='subject-select'
						value={selectedSubject}
						onChange={handleSubjectChange}
						className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
						disabled={!selectedGroup} // Отключаем, если группа не выбрана
					>
						<option value=''>Выберите предмет</option>
						{selectedGroup &&
							subjectsMap[selectedGroup]?.map(subject => (
								<option key={subject} value={subject}>
									{subject}
								</option>
							))}
					</select>
				</div>
				<div className='mb-4'>
					<label
						htmlFor='amount-input'
						className='block text-sm font-medium text-gray-700'
					>
						Количество
					</label>
					<input
						id='amount-input'
						type='number'
						value={amount}
						onChange={handleAmountChange}
						className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
						min={0}
					/>
				</div>
				<div className='mb-4'>
					<label
						htmlFor='lesson-type-select'
						className='block text-sm font-medium text-gray-700'
					>
						Тип занятия
					</label>
					<select
						id='lesson-type-select'
						value={lessonType}
						onChange={handleLessonTypeChange}
						className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
					>
						<option value='L'>Лекция</option>
						<option value='1'>Первая подгруппа</option>
						<option value='2'>Вторая подгруппа</option>
					</select>
				</div>
				<ButtonGeneration title={"Добавить"} />
			</form>
		</>
	);
};
