"use client";
import {
	amountLimitsAtom,
	daysAtom,
	groupsAtom,
	subjectsMapAtom,
	teachersAtom,
	teachersMapAtom,
} from "@/jotai/schedule";
import { CombinedRecord } from "@/types/schedule.type";
import { useAtom } from "jotai";
import { useState } from "react";
import { toast } from "sonner";
import { ButtonGeneration } from "../ui/buttons/ButtonGeneration";
import { FieldGeneration } from "../ui/fields/FieldGeneration";
import { FieldMulti } from "../ui/fields/FieldMulti";
import {
	EnumTypeArray,
	SelectMultiSubject,
} from "../ui/select/SelectMultiSubject";
import { ConclusionSubjects } from "./СonclusionSubjects";

export const MultiSubject = () => {
	const [arrayDays] = useAtom(daysAtom);
	const [groups, setGroups] = useAtom(groupsAtom);
	const [subjectsMap, setSubjectsMap] = useAtom(subjectsMapAtom);
	const [teachersMap, setTeachersMap] = useAtom(teachersMapAtom);
	const [amountLimits, setAmountLimits] = useAtom(amountLimitsAtom);
	const [teachers, setTeachers] = useAtom(teachersAtom);

	const formattedTeachers = teachers?.map(teacher => ({
		tid: teacher.tid,
		name: teacher.name,
	}));

	const [selectedGroup, setSelectedGroup] = useState("");
	const [selectedSubject, setSelectedSubject] = useState("");
	const [selectedTeacher, setSelectedTeacher] = useState("");
	const [lecturesAmount, setLecturesAmount] = useState<number>(0); // лекции (общие)
	const [subgroup1Amount, setSubgroup1Amount] = useState<number>(0); // подгруппа 1
	const [subgroup2Amount, setSubgroup2Amount] = useState<number>(0); // подгруппа 2
	const [lessonType, setLessonType] = useState<"L" | "1" | "2">("L");
	const [inputValue, setInputValue] = useState("");

	const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedGroup(e.target.value);
		setSelectedSubject("");
	};

	const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedSubject(e.target.value);
	};

	const handleTeacherChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedTeacher(e.target.value);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	const handleAddSubject = () => {
		if (!selectedGroup || !inputValue) {
			toast.error("Выберите группу и введите название предмета!");
			return;
		}

		// Добавляем в subjectsMap
		setSubjectsMap(prev => ({
			...prev,
			[selectedGroup]: prev[selectedGroup]?.includes(inputValue)
				? [...prev[selectedGroup]]
				: [...(prev[selectedGroup] || []), inputValue],
		}));

		// Формируем три типа записей
		if (lecturesAmount > 0) {
			setAmountLimits(prev => [
				...prev,
				{
					group: selectedGroup,
					subject: inputValue,
					amount: lecturesAmount,
					lessonType: "L",
				},
			]);
		}

		if (subgroup1Amount > 0) {
			setAmountLimits(prev => [
				...prev,
				{
					group: `${selectedGroup}`,
					subject: inputValue,
					amount: subgroup1Amount,
					lessonType: "1",
				},
			]);
		}

		if (subgroup2Amount > 0) {
			setAmountLimits(prev => [
				...prev,
				{
					group: `${selectedGroup}`,
					subject: inputValue,
					amount: subgroup2Amount,
					lessonType: "2",
				},
			]);
		}

		// Привязываем преподавателя ко всем трём типам занятий
		const tid = parseInt(selectedTeacher);
		if (tid && !isNaN(tid)) {
			if (lecturesAmount > 0) {
				setTeachersMap(prev => [
					...prev,
					{ tid, subject: inputValue, group: selectedGroup },
				]);
			}
			if (subgroup1Amount > 0) {
				setTeachersMap(prev => [
					...prev,
					{ tid, subject: inputValue, group: `${selectedGroup}-1` },
				]);
			}
			if (subgroup2Amount > 0) {
				setTeachersMap(prev => [
					...prev,
					{ tid, subject: inputValue, group: `${selectedGroup}-2` },
				]);
			}
		}

		// Сброс формы
		setInputValue("");
		setLecturesAmount(0);
		setSubgroup1Amount(0);
		setSubgroup2Amount(0);
		setSelectedGroup("");
		setSelectedTeacher("");
		setLessonType("L");

		toast.success("Предмет и нагрузки успешно добавлены!");
	};

	// Удаление группы
	const handleRemoveGroup = (group: string) => {
		if (window.confirm(`Удалить группу "${group}" и все её предметы?`)) {
			setGroups(prev => prev.filter(g => g !== group));
			setSubjectsMap(prev => {
				const updated = { ...prev };
				delete updated[group];
				return updated;
			});
			toast.success(`Группа "${group}" удалена`);
		}
	};

	// Удаление предмета из subjectsMap
	const handleRemoveSubject = (group: string, subject: string) => {
		if (window.confirm(`Удалить предмет "${subject}" у группы "${group}"?`)) {
			setSubjectsMap(prev => ({
				...prev,
				[group]: prev[group].filter(s => s !== subject),
			}));
			toast.success(`Предмет "${subject}" удален из "${group}"`);
		}
	};

	// Удаление записи из amountLimits
	const handleRemoveAmountLimit = (index: number) => {
		if (window.confirm("Вы уверены, что хотите удалить эту запись?")) {
			setAmountLimits(prev => prev.filter((_, i) => i !== index));
			toast.success("Запись удалена");
		}
	};

	// Удаление из teachersMap
	const handleRemoveTeachersMap = (tid: number) => {
		if (window.confirm("Вы уверены, что хотите удалить эту запись?")) {
			setTeachersMap(prev => prev.filter(item => item.tid !== tid));
			toast.success("Преподаватель удален из привязки");
		}
	};

	// Получаем имя преподавателя по tid
	const getTeacherName = (tid: number) =>
		formattedTeachers.find(t => t.tid === tid)?.name ||
		"Неизвестный преподаватель";

	// Создание объединенного списка для вывода
	const combinedRecords: CombinedRecord[] = amountLimits.map(limit => ({
		group: limit.group,
		subject: limit.subject,
		teacherName: (() => {
			const teacher = teachersMap.find(
				t => t.group === limit.group && t.subject === limit.subject
			);
			return teacher ? getTeacherName(teacher.tid) : "Не назначен";
		})(),
		amount: limit.amount,
		lessonType: limit.lessonType as "L" | "1" | "2",
	}));

	return (
		<>
			<ConclusionSubjects
				combinedRecords={combinedRecords}
				handleRemoveAmountLimit={handleRemoveAmountLimit}
			/>
			<form
				onSubmit={e => {
					e.preventDefault();
					handleAddSubject();
				}}
			>
				<SelectMultiSubject
					label={"Выберите группу"}
					id={"group"}
					value={selectedGroup}
					onChange={handleGroupChange}
					array={groups}
					type={EnumTypeArray.COMMON}
				/>

				<FieldGeneration
					label={"Название предмета"}
					name={"subject"}
					value={inputValue}
					onChange={handleInputChange}
				/>

				<SelectMultiSubject
					label={"Выберите преподавателя"}
					id={"teacher"}
					value={selectedTeacher}
					onChange={handleTeacherChange}
					array={formattedTeachers}
					type={EnumTypeArray.OBJECT}
				/>

				{/* Поля для ввода количества */}
				<div className='space-y-4 mt-4'>
					<FieldMulti
						label={"Количество часов лекций"}
						id={"lectures"}
						value={lecturesAmount}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setLecturesAmount(parseInt(e.target.value) || 0)
						}
					/>
					<FieldMulti
						label={"Количество часов на первую подгруппу"}
						id={"subgroup1"}
						value={subgroup1Amount}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setSubgroup1Amount(parseInt(e.target.value) || 0)
						}
					/>
					<FieldMulti
						label={"Количество часов на вторую подгруппу"}
						id={"subgroup2"}
						value={subgroup2Amount}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setSubgroup2Amount(parseInt(e.target.value) || 0)
						}
					/>
				</div>

				<ButtonGeneration title={"Добавить предмет"} />
			</form>
		</>
	);
};
