"use client";

import { daysArrayAtom } from "@/jotai/days";
import dayjs from "dayjs";
import { useAtom } from "jotai";

type Props = {
	date: dayjs.Dayjs;
};

export const Days = ({ date }: Props) => {
	const [arrayDays, setArrayDays] = useAtom<number[]>(daysArrayAtom);

	const daysInMonth = date.daysInMonth();
	const firstDayOfMonth = date.startOf("month").day();
	const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

	const handleDayClick = (day: number) => {
		if (arrayDays.includes(day)) {
			setArrayDays(prev => prev.filter(d => d !== day));
		} else {
			setArrayDays(prev => [...prev, day]);
		}
	};

	return (
		<div>
			<div className='text-center text-xl font-bold mb-6 text-indigo-600'>
				{date.format("MMMM YYYY")}
			</div>
			<div className='grid grid-cols-7 gap-2'>
				{["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map(day => (
					<div
						key={day}
						className='text-center text-sm font-medium text-gray-500'
					>
						{day}
					</div>
				))}
				{Array.from({ length: adjustedFirstDay }, (_, i) => (
					<div key={`empty-${i}`} className='p-2' />
				))}
				{Array.from({ length: daysInMonth }, (_, i) => {
					const day = i + 1;
					const dayOfWeek = date.date(day).day();
					const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
					const isToday = date.date(day).isSame(dayjs(), "day");

					const isSelected = arrayDays.includes(day);

					return (
						<div
							onClick={() => handleDayClick(day)}
							key={day}
							className={`p-2 text-center border-2 rounded-lg shadow-sm flex items-center justify-center text-2xl cursor-pointer
								${isWeekend ? "bg-gray-100 text-gray-600" : "bg-white text-indigo-900"}
                ${
									isToday
										? "border-indigo-600 bg-indigo-50 font-bold"
										: "border-indigo-200"
								}
                ${isSelected ? "bg-indigo-200 text-indigo-900" : ""}`}
						>
							{day}
						</div>
					);
				})}
			</div>
		</div>
	);
};
