"use client";
import { groupsAtom, subjectsMapAtom } from "@/jotai/schedule";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ButtonGeneration } from "../ui/buttons/ButtonGeneration";
import { FieldGeneration } from "../ui/fields/FieldGeneration";

export const SubjectMap = () => {
	const [subjectsMap, setSubjectsMap] =
		useAtom<Record<string, string[]>>(subjectsMapAtom);
	const [groups, setGroups] = useAtom<string[]>(groupsAtom);
	const [inputValue, setInputValue] = useState("");
	const [selectedGroup, setSelectedGroup] = useState("");

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedGroup(e.target.value);
	};

	const handleAddSubject = () => {
		const trimmedValue = inputValue.trim();

		if (trimmedValue && selectedGroup) {
			const isDuplicate = subjectsMap[selectedGroup]?.includes(trimmedValue);
			if (isDuplicate) {
				toast.error("Предмет уже добавлен для этой группы!");
			} else {
				setSubjectsMap(prev => ({
					...prev,
					[selectedGroup]: [...(prev[selectedGroup] || []), trimmedValue],
				}));
				setInputValue("");
				toast.success("Предмет добавлен!");
			}
		} else {
			toast.error("Выберите группу и введите название предмета!");
		}
	};

	const handleRemoveGroup = (group: string) => {
		if (
			window.confirm(
				`Вы уверены, что хотите удалить группу "${group}" и все её предметы?`
			)
		) {
			setGroups(prev => prev.filter(g => g !== group));
			setSubjectsMap(prev => {
				const newSubjectsMap = { ...prev };
				delete newSubjectsMap[group];
				return newSubjectsMap;
			});
			toast.success(`Группа "${group}" и все её предметы удалены!`);
		}
	};

	const handleRemoveSubject = (group: string, subject: string) => {
		if (
			window.confirm(
				`Вы уверены, что хотите удалить предмет "${subject}" для группы "${group}"?`
			)
		) {
			setSubjectsMap(prev => ({
				...prev,
				[group]: prev[group].filter(s => s !== subject),
			}));
			toast.success(`Предмет "${subject}" удален для группы "${group}"!`);
		}
	};

	useEffect(() => {
		console.log(groups);
	}, [groups]);

	return (
		<>
			<div className='mb-4 p-4 border rounded-lg flex flex-wrap gap-2'>
				{Object.entries(subjectsMap).map(([group, subjects]) => (
					<div key={group} className='mb-4'>
						<div className='flex items-center justify-between'>
							<h3 className='font-semibold text-lg mb-2'>{group}</h3>
							<button
								onClick={() => handleRemoveGroup(group)}
								className='text-red-500 hover:text-red-700'
							>
								Удалить группу
							</button>
						</div>
						<div className='flex flex-wrap gap-2'>
							{subjects.map(subject => (
								<div
									key={subject}
									onClick={() => handleRemoveSubject(group, subject)}
									className='px-3 py-1 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300 transition-colors'
								>
									{subject}
								</div>
							))}
						</div>
					</div>
				))}
			</div>
			<form
				onSubmit={e => {
					e.preventDefault();
					handleAddSubject();
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
				<FieldGeneration
					label={"Название предмета"}
					name={"subject"}
					value={inputValue}
					onChange={handleInputChange}
				/>
				<ButtonGeneration title={"Добавить предмет"} />
			</form>
		</>
	);
};
