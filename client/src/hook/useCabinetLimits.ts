import {
	cabinetLimitsAtom,
	cabinetsAtom,
	teachersAtom,
} from "@/jotai/schedule";
import { TypeCabinetLimits, TypeTeachers } from "@/types/schedule.type";
import { useAtom } from "jotai";
import { useState } from "react";
import { toast } from "sonner";

export const useCabinetLimits = () => {
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

	return {
		cabinetLimits,
		setCabinetLimits,
		teachers,
		cabinets,
		selectedTeacher,
		selectedCabinets,
		showAll,
		setShowAll,
		searchTerm,
		setSearchTerm,
		getTeacherName,
		displayedLimits,
		handleAddCabinetLimit,
		handleCabinetsChange,
		handleTeacherChange,
		handleRemoveCabinetLimit,
		filteredLimits,
	};
};
