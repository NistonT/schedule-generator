"use client";

import { daysAtom } from "@/jotai/schedule";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { useMemo } from "react";

type Props = {
	date: dayjs.Dayjs;
};

export const Days = ({ date }: Props) => {
	const [arrayDays, setArrayDays] = useAtom(daysAtom);

	// Кэшируем значения дней месяца и первого дня месяца
	const daysInMonth = useMemo(() => date.daysInMonth(), [date]);
	const firstDayOfMonth = useMemo(() => date.startOf("month").day(), [date]);
	const adjustedFirstDay = useMemo(
		() => (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1),
		[firstDayOfMonth]
	);

	// Обработчик клика по дню
	const handleDayClick = (day: number) => {
		const formattedDate = date.date(day).format("YYYY-MM-DD");
		setArrayDays(prev =>
			prev.includes(formattedDate)
				? prev.filter(d => d !== formattedDate)
				: [...prev, formattedDate]
		);
	};

	return (
		<div className='select-none'>
			{/* Заголовок месяца */}
			<div className='text-center text-xl font-bold mb-6 text-indigo-600'>
				{date.format("MMMM YYYY")}
			</div>

			{/* Дни недели */}
			<div className='grid grid-cols-7 gap-2'>
				{["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map(day => (
					<div
						key={day}
						className='text-center text-sm font-medium text-gray-500'
					>
						{day}
					</div>
				))}

				{/* Пустые ячейки перед первым днем месяца */}
				{Array.from({ length: adjustedFirstDay }).map((_, i) => (
					<div key={`empty-${i}`} className='p-2' />
				))}

				{/* Дни месяца */}
				{Array.from({ length: daysInMonth }).map((_, i) => {
					const day = i + 1;
					const currentDate = useMemo(() => date.date(day), [date, day]);
					const dayOfWeek = currentDate.day();
					const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
					const isToday = currentDate.isSame(dayjs(), "day");
					const isPastDate = currentDate.isBefore(dayjs(), "day");
					const formattedDate = currentDate.format("YYYY-MM-DD");
					const isSelected = arrayDays.includes(formattedDate);

					return (
						<div
							key={day}
							onClick={() => !isPastDate && handleDayClick(day)}
							className={`p-2 text-center border-2 rounded-lg shadow-sm flex items-center justify-center text-2xl cursor-pointer select-none ${
								isPastDate
									? "bg-gray-50 text-gray-300 cursor-not-allowed"
									: isSelected
									? "!bg-indigo-200 !text-indigo-900"
									: isWeekend
									? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
									: "bg-white text-indigo-900 hover:bg-indigo-50"
							} ${
								isToday
									? "border-indigo-600 bg-indigo-50 font-bold"
									: "border-indigo-200"
							}`}
						>
							{day}
						</div>
					);
				})}
			</div>
		</div>
	);
};
