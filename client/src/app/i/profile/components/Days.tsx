"use client";

import { daysAtom } from "@/jotai/schedule";
import { excludedDaysOfWeekAtom, viewModeAtom } from "@/jotai/viewModeAtom";
import dayjs, { Dayjs } from "dayjs";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";

type Props = {
	date: Dayjs;
	onClear?: () => void;
};

export const Days = ({ date, onClear }: Props) => {
	const [arrayDays, setArrayDays] = useAtom(daysAtom);
	const [isSelecting, setIsSelecting] = useState(false);
	const [startDay, setStartDay] = useState<number | null>(null);
	const [isShiftPressed, setIsShiftPressed] = useState(false);
	const [viewMode, setViewMode] = useAtom(viewModeAtom);
	const [excludedDaysOfWeek] = useAtom(excludedDaysOfWeekAtom);

	// Кэшируем значения дней месяца и первого дня месяца
	const daysInMonth = useMemo(() => date.daysInMonth(), [date]);
	const firstDayOfMonth = useMemo(() => date.startOf("month").day(), [date]);
	const adjustedFirstDay = useMemo(
		() => (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1),
		[firstDayOfMonth]
	);

	// Обработчик начала выделения (только при зажатом Shift)
	const handleMouseDown = (e: React.MouseEvent, day: number) => {
		if (!e.shiftKey || viewMode !== "day") return;

		const currentDate = date.date(day);
		if (currentDate.isBefore(dayjs(), "day")) return;

		setIsShiftPressed(true);
		setIsSelecting(true);
		setStartDay(day);

		const formattedDate = currentDate.format("YYYY-MM-DD");

		setArrayDays(prev =>
			prev.includes(formattedDate)
				? prev.filter(d => d !== formattedDate)
				: [...prev, formattedDate]
		);
	};

	// Добавляем дни при движении мыши над другими ячейками
	const handleMouseEnter = (day: number) => {
		if (
			!isShiftPressed ||
			!isSelecting ||
			startDay === null ||
			viewMode !== "day"
		)
			return;

		const min = Math.min(startDay, day);
		const max = Math.max(startDay, day);

		const newDates: string[] = [];

		for (let d = min; d <= max; d++) {
			const current = date.date(d);
			const dayOfWeek = current.day();

			if (excludedDaysOfWeek.has(dayOfWeek)) continue;

			const formattedDate = current.format("YYYY-MM-DD");
			newDates.push(formattedDate);
		}

		setArrayDays(prev => {
			const uniqueNewDates = Array.from(new Set([...prev, ...newDates]));
			return uniqueNewDates;
		});
	};

	// Завершаем выделение
	const handleMouseUp = () => {
		setIsSelecting(false);
		setIsShiftPressed(false);
		setStartDay(null);
	};

	useEffect(() => {
		window.addEventListener("mouseup", handleMouseUp);
		return () => {
			window.removeEventListener("mouseup", handleMouseUp);
		};
	}, []);

	// Переключение масштаба
	const zoomIn = () => {
		if (viewMode === "day") setViewMode("week");
		if (viewMode === "week") setViewMode("month");
	};

	const zoomOut = () => {
		if (viewMode === "month") setViewMode("week");
		if (viewMode === "week") setViewMode("day");
	};

	// Получить даты недели
	const getWeekDates = (startDate: Dayjs) => {
		const dates: string[] = [];
		for (let i = 0; i < 7; i++) {
			const current = startDate.add(i, "day");
			const dayOfWeek = current.day();
			if (excludedDaysOfWeek.has(dayOfWeek)) continue;
			dates.push(current.format("YYYY-MM-DD"));
		}
		return dates;
	};

	// Получить даты месяца без выходных
	const getMonthDates = (monthDate: Dayjs) => {
		const totalDays = monthDate.daysInMonth();
		const dates: string[] = [];

		for (let day = 1; day <= totalDays; day++) {
			const current = monthDate.date(day);
			const dayOfWeek = current.day();
			if (excludedDaysOfWeek.has(dayOfWeek)) continue;
			dates.push(current.format("YYYY-MM-DD"));
		}

		return dates;
	};

	// Проверка, все ли даты выбраны
	const isAllSelected = (dates: string[]) => {
		return dates.every(d => arrayDays.includes(d));
	};

	// Обработчик клика на неделю
	const handleWeekClick = (weekStartDate: Dayjs) => {
		const weekDates = getWeekDates(weekStartDate);
		const allSelected = isAllSelected(weekDates);

		setArrayDays(prev => {
			if (allSelected) {
				return prev.filter(d => !weekDates.includes(d));
			} else {
				const newDates = weekDates.filter(d => !prev.includes(d));
				return [...prev, ...newDates];
			}
		});
	};

	// Обработчик клика на месяц
	const handleMonthClick = (monthIndex: number) => {
		const monthDate = date.month(monthIndex);
		const monthDates = getMonthDates(monthDate);
		const allSelected = isAllSelected(monthDates);

		setArrayDays(prev => {
			if (allSelected) {
				return prev.filter(d => !monthDates.includes(d));
			} else {
				const newDates = monthDates.filter(d => !prev.includes(d));
				return [...prev, ...newDates];
			}
		});
	};

	// Месяцы для отображения в режиме `month`
	const months = useMemo(() => {
		const result = [];
		for (let i = 0; i < 12; i++) {
			const monthDate = date.month(i);
			result.push({
				name: monthDate.format("MMM"),
				value: i,
			});
		}
		return result;
	}, [date]);

	return (
		<div className='select-none p-4'>
			{/* Управление масштабом */}
			<div className='flex items-center justify-between mb-4'>
				<div>
					<button
						onClick={zoomOut}
						className='px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition'
					>
						-
					</button>
					<button
						onClick={zoomIn}
						className='ml-2 px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition'
					>
						+
					</button>
				</div>

				{/* Заголовок месяца или года */}
				<div className='text-center text-xl font-bold text-gray-950'>
					{viewMode === "month"
						? date.format("YYYY")
						: date.format("MMMM YYYY")}
				</div>

				<button
					onClick={onClear}
					className='px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition'
				>
					Очистить
				</button>
			</div>

			{/* Режим месяцев */}
			{viewMode === "month" && (
				<div className='grid grid-cols-3 gap-4'>
					{months.map(m => {
						const monthDate = date.month(m.value);
						const monthDates = getMonthDates(monthDate);
						const allSelected = isAllSelected(monthDates);

						return (
							<motion.div
								key={m.value}
								onClick={() => handleMonthClick(m.value)}
								className={`p-3 text-center border rounded-lg shadow-sm bg-white text-gray-950 cursor-pointer ${
									allSelected
										? "bg-indigo-200 border-indigo-500"
										: "hover:bg-indigo-50 border-indigo-200"
								}`}
								initial={{ scale: 1 }}
								whileTap={{ scale: 0.98 }}
								transition={{ type: "spring", stiffness: 300 }}
							>
								{m.name}
							</motion.div>
						);
					})}
				</div>
			)}

			{/* Режим недель */}
			{viewMode === "week" && (
				<div className='grid grid-cols-1 gap-2'>
					{Array.from({ length: 6 }).map((_, weekIndex) => {
						const startWeekDay = date
							.startOf("month")
							.add(weekIndex * 7, "day");
						const endWeekDay = startWeekDay.endOf("week");

						if (startWeekDay.month() !== date.month()) return null;

						const weekDates = getWeekDates(startWeekDay);
						const allSelected = isAllSelected(weekDates);

						return (
							<motion.div
								key={weekIndex}
								onClick={() => handleWeekClick(startWeekDay)}
								className={`p-3 border rounded-lg shadow-sm bg-white text-gray-950 cursor-pointer ${
									allSelected
										? "bg-indigo-200 border-indigo-500"
										: "hover:bg-indigo-50 border-indigo-200"
								}`}
								initial={{ scale: 1 }}
								whileTap={{ scale: 0.98 }}
								transition={{ type: "spring", stiffness: 300 }}
							>
								Неделя {weekIndex + 1} — {startWeekDay.format("D")} –{" "}
								{endWeekDay.format("D MMM")}
							</motion.div>
						);
					})}
				</div>
			)}

			{/* Режим дней */}
			{viewMode === "day" && (
				<>
					{/* Дни недели */}
					<div className='grid grid-cols-7 gap-2'>
						{["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day, index) => (
							<div
								key={day}
								className={`text-center text-sm font-medium ${
									excludedDaysOfWeek.has(index)
										? "text-red-500"
										: "text-gray-500"
								}`}
							>
								{day}
							</div>
						))}
					</div>

					{/* Дни месяца */}
					<div className='grid grid-cols-7 gap-2 mt-2'>
						{/* Пустые ячейки перед первым днем месяца */}
						{Array.from({ length: adjustedFirstDay }).map((_, i) => (
							<div key={`empty-${i}`} />
						))}

						{Array.from({ length: daysInMonth }).map((_, i) => {
							const day = i + 1;
							const currentDate = date.date(day);
							const dayOfWeek = currentDate.day();
							const isExcluded = excludedDaysOfWeek.has(dayOfWeek);
							const isToday = currentDate.isSame(dayjs(), "day");
							const isPastDate = currentDate.isBefore(dayjs(), "day");
							const formattedDate = currentDate.format("YYYY-MM-DD");
							const isSelected = arrayDays.includes(formattedDate);

							return (
								<motion.div
									key={day}
									onMouseDown={e => handleMouseDown(e, day)}
									onMouseEnter={() => handleMouseEnter(day)}
									className={`p-2 text-center border-2 rounded-lg shadow-sm flex items-center justify-center text-2xl cursor-pointer select-none ${
										isPastDate
											? "bg-gray-50 text-gray-300 cursor-not-allowed"
											: isSelected
											? "!bg-indigo-200 !text-gray-950"
											: isExcluded
											? "bg-gray-100 text-gray-400"
											: "bg-white text-gray-950 hover:bg-indigo-50"
									} ${
										isToday
											? "border-gray-950 bg-indigo-50 font-bold"
											: "border-indigo-200"
									}`}
									initial={{ scale: 1 }}
									whileHover={!isExcluded ? { scale: 1.05 } : {}}
									whileTap={!isExcluded ? { scale: 0.95 } : {}}
								>
									{day}
								</motion.div>
							);
						})}
					</div>
				</>
			)}
		</div>
	);
};
