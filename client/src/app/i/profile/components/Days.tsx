"use client";

import { daysAtom } from "@/jotai/schedule";
import dayjs from "dayjs";
import { useAtom } from "jotai";

type Props = {
	date: dayjs.Dayjs;
};

export const Days = ({ date }: Props) => {
	const [arrayDays, setArrayDays] = useAtom(daysAtom);

	const daysInMonth = date.daysInMonth();
	const firstDayOfMonth = date.startOf("month").day();
	const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

	const handleDayClick = (day: number) => {
		const formattedDate = date.date(day).format("YYYY-MM-DD");
		setArrayDays(prev => {
			if (prev.includes(formattedDate)) {
				return prev.filter(d => d !== formattedDate);
			} else {
				return [...prev, formattedDate];
			}
		});
	};

	return (
		<div className='select-none'>
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
					const currentDate = date.date(day);
					const dayOfWeek = currentDate.day();
					const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
					const isToday = currentDate.isSame(dayjs(), "day");
					const isPastDate = currentDate.isBefore(dayjs(), "day");
					const formattedDate = currentDate.format("YYYY-MM-DD");
					const isSelected = arrayDays.includes(formattedDate);

					return (
						<div
							key={day}
							onClick={() => !isPastDate && !isWeekend && handleDayClick(day)}
							className={`p-2 text-center border-2 rounded-lg shadow-sm flex items-center justify-center text-2xl cursor-pointer select-none 
                ${
									isWeekend
										? "bg-gray-100 text-gray-400 cursor-not-allowed"
										: isPastDate
										? "bg-gray-50 text-gray-300 cursor-not-allowed"
										: "bg-white text-indigo-900 hover:bg-indigo-50"
								}
                ${
									isToday
										? "border-indigo-600 bg-indigo-50 font-bold"
										: "border-indigo-200"
								}
                ${isSelected ? "!bg-indigo-200 !text-indigo-900" : ""}
              `}
						>
							{day}
						</div>
					);
				})}
			</div>
		</div>
	);
};
