"use client";
import { daysAtom } from "@/jotai/schedule";
import dayjs from "dayjs";
import { useAtomValue } from "jotai";
import { useState } from "react";

export const Days = () => {
	const days = useAtomValue(daysAtom);
	const [showAll, setShowAll] = useState(false);

	// Форматируем даты в более читаемый вид
	const formatDate = (dateStr: string) => {
		return dayjs(dateStr).format("D MMMM YYYY");
	};

	// Определяем, сколько дат показывать
	const displayDays = () => {
		if (days.length <= 5 || showAll) {
			return days;
		}
		return [days[0], days[1], days[2], "...", days[days.length - 1]];
	};

	return (
		<div className='bg-white rounded-lg shadow-sm p-4 border border-gray-200'>
			<div className='flex justify-between'>
				<h2 className='text-lg font-semibold mb-4 text-gray-800'>
					Выбранные дни ({days.length})
				</h2>
				{days.length > 5 && (
					<button
						onClick={() => setShowAll(!showAll)}
						className='text-indigo-600 hover:text-indigo-800 text-sm font-medium'
					>
						{showAll ? "Свернуть" : "Показать все"}
					</button>
				)}
			</div>

			<ul className='space-y-2 mb-4'>
				{displayDays().map((day, index) => (
					<li
						key={day === "..." ? `ellipsis-${index}` : day}
						className='flex items-center text-gray-700'
					>
						{day === "..." ? (
							<span className='text-gray-500 ml-6'>...</span>
						) : (
							<>
								<span className='w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center mr-3'>
									<span className='w-2 h-2 bg-indigo-600 rounded-full'></span>
								</span>
								<span>{formatDate(day)}</span>
							</>
						)}
					</li>
				))}
			</ul>
		</div>
	);
};
