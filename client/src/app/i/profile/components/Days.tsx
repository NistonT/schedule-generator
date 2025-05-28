"use client";

import { daysAtom } from "@/jotai/schedule";
import { excludedDaysOfWeekAtom, viewModeAtom } from "@/jotai/viewModeAtom";
import dayjs, { Dayjs } from "dayjs";
import { useAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { DayMode } from "./DayMode";
import { MonthlyMode } from "./MonthlyMode";
import { ScaleControl } from "./ScaleControl";
import { WeekMode } from "./WeekMode";

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
	const [excludedDaysOfWeek, setExcludedDaysOfWeek] = useAtom(
		excludedDaysOfWeekAtom
	);

	const handleClear = () => {
		setArrayDays([]);
	};

	// Кэшируем значения дней месяца и первого дня месяца
	const daysInMonth = useMemo(() => date.daysInMonth(), [date]);
	const firstDayOfMonth = useMemo(() => date.startOf("month").day(), [date]);
	const adjustedFirstDay = useMemo(
		() => (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1),
		[firstDayOfMonth]
	);

	const handleRightClick = (e: React.MouseEvent, day: number) => {
		e.preventDefault(); // 🔥 Блокируем стандартное меню браузера
		e.stopPropagation();

		const currentDate = date.date(day);
		const dayOfWeek = currentDate.day();

		if (excludedDaysOfWeek.has(dayOfWeek)) return; // если день исключён — не выбираем

		const formattedDate = currentDate.format("YYYY-MM-DD");
		const isSelected = arrayDays.includes(formattedDate);

		// Просто добавляем или убираем дату по ПКМ
		setArrayDays(prev =>
			isSelected
				? prev.filter(d => d !== formattedDate)
				: [...prev, formattedDate]
		);
	};

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

			<ScaleControl
				zoomIn={zoomIn}
				zoomOut={zoomOut}
				viewMode={viewMode}
				date={date}
				onClear={handleClear}
			/>

			{/* Режим месяцев */}
			<MonthlyMode
				viewMode={viewMode}
				months={months}
				date={date}
				arrayDays={arrayDays}
				handleMonthClick={handleMonthClick}
				isAllSelected={isAllSelected}
				getMonthDates={getMonthDates}
			/>

			{/* Режим недель */}
			<WeekMode
				viewMode={viewMode}
				date={date}
				isAllSelected={isAllSelected}
				getWeekDates={getWeekDates}
				handleWeekClick={handleWeekClick}
			/>

			{/* Режим дней */}
			<DayMode
				viewMode={viewMode}
				excludedDaysOfWeek={excludedDaysOfWeek}
				adjustedFirstDay={adjustedFirstDay}
				daysInMonth={daysInMonth}
				date={date}
				arrayDays={arrayDays}
				handleMouseDown={handleMouseDown}
				handleMouseEnter={handleMouseEnter}
				handleRightClick={handleRightClick}
			/>
		</div>
	);
};
