"use client";
import { typeLessons } from "@/constants/schedule.constants";
import {
	amountLimitsAtom,
	groupsAtom,
	subjectsMapAtom,
	teachersAtom,
	teachersMapAtom,
} from "@/jotai/schedule";
import {
	CombinedRecord,
	TypeAmountLimits,
	TypeTeachers,
	TypeTeachersMap,
} from "@/types/schedule.types";
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
	const [amountLimits, setAmountLimits] =
		useAtom<TypeAmountLimits[]>(amountLimitsAtom);
	const [teachersMap, setTeachersMap] =
		useAtom<TypeTeachersMap[]>(teachersMapAtom);
	const [subjectsMap, setSubjectsMap] =
		useAtom<Record<string, string[]>>(subjectsMapAtom);
	const [groups, setGroups] = useAtom<string[]>(groupsAtom);
	const [teachers, setTeachers] = useAtom<TypeTeachers[]>(teachersAtom);

	const formattedTeachers = teachers?.map(teacher => ({
		tid: teacher.tid,
		name: teacher.name,
	}));

	const [selectedGroup, setSelectedGroup] = useState("");
	const [selectedSubject, setSelectedSubject] = useState("");
	const [selectedTeacher, setSelectedTeacher] = useState("");
	const [amount, setAmount] = useState<number>(0);
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

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value, 10);
		setAmount(isNaN(value) ? 0 : value);
	};

	const handleLessonTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setLessonType(e.target.value as "L" | "1" | "2");
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	// Основная функция добавления предмета с привязкой к группе, преподавателю и количеству
	const handleAddSubject = () => {
		const trimmedValue = inputValue.trim();

		if (!trimmedValue || !selectedGroup || !selectedTeacher || amount <= 0) {
			toast.error("Заполните все поля корректно!");
			return;
		}

		// Проверка на дубликат предмета для группы
		const isSubjectDuplicate =
			subjectsMap[selectedGroup]?.includes(trimmedValue);
		if (isSubjectDuplicate) {
			toast.error("Предмет уже добавлен для этой группы!");
			return;
		}

		// Проверка на дубликат записи в amountLimits
		const isAmountLimitDuplicate = amountLimits.some(
			item =>
				item.group === selectedGroup &&
				item.subject === trimmedValue &&
				item.lessonType === lessonType
		);
		if (isAmountLimitDuplicate) {
			toast.error("Ограничение для этого предмета уже существует!");
			return;
		}

		// Проверка на дубликат записи в teachersMap
		const isTeacherMapDuplicate = teachersMap.some(
			item =>
				item.group === selectedGroup &&
				item.subject === trimmedValue &&
				item.tid === parseInt(selectedTeacher)
		);
		if (isTeacherMapDuplicate) {
			toast.error("Преподаватель уже привязан к этому предмету!");
			return;
		}

		// Добавление предмета в subjectsMap
		setSubjectsMap(prev => ({
			...prev,
			[selectedGroup]: [...(prev[selectedGroup] || []), trimmedValue],
		}));

		// Добавление записи в amountLimits
		const newAmountLimit: TypeAmountLimits = {
			group: selectedGroup,
			subject: trimmedValue,
			amount: amount,
			lessonType: lessonType,
		};
		setAmountLimits(prev => [...prev, newAmountLimit]);

		// Добавление записи в teachersMap
		const newTeacherMap: TypeTeachersMap = {
			tid: parseInt(selectedTeacher),
			subject: trimmedValue,
			group: selectedGroup,
		};
		setTeachersMap(prev => [...prev, newTeacherMap]);

		// Очистка полей
		setInputValue("");
		setAmount(0);
		setSelectedGroup("");
		setSelectedTeacher("");
		setLessonType("L");

		toast.success("Предмет успешно добавлен!");
	};

	// Удаление группы и её предметов
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

	// Удаление предмета
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

	// Удаление записи из amountLimits
	const handleRemoveAmountLimit = (index: number) => {
		if (window.confirm("Вы уверены, что хотите удалить эту запись?")) {
			setAmountLimits(prev => prev.filter((_, i) => i !== index));
			toast.success("Запись удалена!");
		}
	};

	// Удаление записи из teachersMap
	const handleRemoveTeachersMap = (tid: number) => {
		if (window.confirm("Вы уверены, что хотите удалить эту запись?")) {
			setTeachersMap(prev => prev.filter(item => item.tid !== tid));
			toast.success("Запись удалена!");
		}
	};

	// Функция для получения имени преподавателя по его tid
	const getTeacherName = (tid: number) => {
		const teacher = formattedTeachers?.find(t => t.tid === tid);
		return teacher ? teacher.name : "Неизвестный преподаватель";
	};

	// Создание объединенного списка для вывода
	const combinedRecords: CombinedRecord[] = amountLimits.map(amountLimit => {
		const teacherRecord = teachersMap.find(
			record =>
				record.group === amountLimit.group &&
				record.subject === amountLimit.subject
		);

		// Убедимся, что lessonType соответствует типу "L" | "1" | "2"
		const lessonType = amountLimit.lessonType as "L" | "1" | "2";

		return {
			group: amountLimit.group,
			subject: amountLimit.subject,
			teacherName: teacherRecord
				? getTeacherName(teacherRecord.tid)
				: "Неизвестный преподаватель",
			amount: amountLimit.amount,
			lessonType: lessonType,
		};
	});

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
				<FieldMulti
					label={"Количество"}
					id={"amount"}
					value={amount}
					onChange={handleAmountChange}
				/>
				<SelectMultiSubject
					label={"Тип занятия"}
					id={"lesson-type"}
					value={lessonType}
					onChange={handleLessonTypeChange}
					type={EnumTypeArray.TYPE}
					array={typeLessons}
				/>
				<ButtonGeneration title={"Добавить предмет"} />
			</form>
		</>
	);
};
