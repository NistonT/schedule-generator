"use client";
import { daysAtom } from "@/jotai/schedule";
import { useAtomValue } from "jotai";

export const Days = () => {
	const days = useAtomValue(daysAtom);

	return (
		<div>
			<h2 className='text-lg font-semibold mb-4'>Выбранные дни:</h2>
			<ul className='list-disc list-inside mb-4'>
				{days.map(day => (
					<li key={day}>{day}</li> // Отображаем даты в формате "YYYY-MM-DD"
				))}
			</ul>
		</div>
	);
};
