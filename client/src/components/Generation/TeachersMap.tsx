"use client";
import {
	groupsAtom,
	subjectsMapAtom,
	teachersAtom,
	teachersMapAtom,
} from "@/jotai/schedule";
import { TypeTeachers, TypeTeachersMap } from "@/types/schedule.types";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ButtonGeneration } from "../ui/buttons/ButtonGeneration";

export const TeachersMap = () => {
	const [teachersMap, setTeachersMap] =
		useAtom<TypeTeachersMap[]>(teachersMapAtom);
	const [groups, setGroups] = useAtom<string[]>(groupsAtom);
	const [teachers, setTeachers] = useAtom<TypeTeachers[]>(teachersAtom);
	const [subjectsMap, setSubjectsMap] =
		useAtom<Record<string, string[]>>(subjectsMapAtom);

	const [selectedGroup, setSelectedGroup] = useState("");
	const [selectedTeacher, setSelectedTeacher] = useState("");
	const [selectedSubject, setSelectedSubject] = useState("");

	// Обработчик изменения выбранной группы
	const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedGroup(e.target.value);
		setSelectedSubject(""); // Сбрасываем выбранный предмет при изменении группы
	};

	// Обработчик изменения выбранного преподавателя
	const handleTeacherChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedTeacher(e.target.value);
	};

	// Обработчик изменения выбранного предмета
	const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedSubject(e.target.value);
	};

	// Добавление записи в teachersMap
	const handleAddTeachersMap = () => {
		if (selectedGroup && selectedTeacher && selectedSubject) {
			// Проверяем, есть ли уже такая запись
			const isDuplicate = teachersMap.some(
				item =>
					item.group === selectedGroup &&
					item.subject === selectedSubject &&
					item.tid === parseInt(selectedTeacher)
			);
			if (isDuplicate) {
				toast.error("Такая запись уже существует!");
			} else {
				// Создаем новую запись
				const newRecord: TypeTeachersMap = {
					tid: parseInt(selectedTeacher), // Преобразуем строку в число
					subject: selectedSubject,
					group: selectedGroup,
				};
				setTeachersMap(prev => [...prev, newRecord]);
				toast.success("Запись добавлена!");
			}
		} else {
			toast.error("Выберите группу, преподавателя и предмет!");
		}
	};

	// Удаление записи из teachersMap
	const handleRemoveTeachersMap = (tid: number) => {
		if (window.confirm("Вы уверены, что хотите удалить эту запись?")) {
			setTeachersMap(prev => prev.filter(item => item.tid !== tid));
			toast.success("Запись удалена!");
		}
	};

	useEffect(() => {
		console.log(subjectsMap);
	}, [subjectsMap]);

	return (
		<>
			<div className='mb-4 p-4 border rounded-lg flex flex-wrap gap-2'>
				{teachersMap.map(record => (
					<div
						key={record.tid}
						className='px-3 py-1 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300 transition-colors'
						onClick={() => handleRemoveTeachersMap(record.tid)}
					>
						{`Группа: ${record.group}, Преподаватель: ${record.tid}, Предмет: ${record.subject}`}
					</div>
				))}
			</div>
			<form
				onSubmit={e => {
					e.preventDefault();
					handleAddTeachersMap();
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
				<ButtonGeneration title={"Добавить"} />
			</form>
		</>
	);
};
