"use client";
import { useCabinetLimits } from "@/hook/useCabinetLimits";
import { m } from "motion/react";
import { FormAddition } from "./CabinetLimits/FormAddition";
import { Restrictions } from "./CabinetLimits/Restrictions";
import { SearchBar } from "./CabinetLimits/SearchBar";

export const CabinetLimits = () => {
	const {
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
	} = useCabinetLimits();

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
			<SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

			{/* Список текущих ограничений */}
			<Restrictions
				filteredLimits={filteredLimits}
				setShowAll={setShowAll}
				showAll={showAll}
				displayedLimits={displayedLimits}
				handleRemoveCabinetLimit={handleRemoveCabinetLimit}
				getTeacherName={getTeacherName}
				searchTerm={searchTerm}
			/>

			{/* Форма добавления */}
			<FormAddition
				handleAddCabinetLimit={handleAddCabinetLimit}
				selectedTeacher={selectedTeacher}
				handleTeacherChange={handleTeacherChange}
				teachers={teachers}
				selectedCabinets={selectedCabinets}
				handleCabinetsChange={handleCabinetsChange}
				cabinets={cabinets}
			/>
		</m.div>
	);
};
