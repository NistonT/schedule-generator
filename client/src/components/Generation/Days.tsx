"use client";
import { daysArrayAtom } from "@/jotai/days";
import { daysAtom } from "@/jotai/schedule";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { useEffect } from "react";

export const Days = () => {
	const [days, setDays] = useAtom(daysAtom); // Количество дней
	const [arrayDays, setArrayDays] = useAtom(daysArrayAtom); // Выбранные дни

	// Обработчик изменения значения в поле ввода
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value, 10); // Преобразуем строку в число
		setDays(isNaN(value) ? 0 : value); // Если ввод не число, устанавливаем 0
	};

	// Обработчик клика по дню
	const handleDayClick = (day: number) => {
		setArrayDays(prev => {
			if (prev.includes(day)) {
				// Если день уже выбран, удаляем его из массива
				return prev.filter(d => d !== day);
			} else {
				// Если день не выбран, добавляем его в массив
				return [...prev, day];
			}
		});
	};

	// Эффект для обновления количества дней при изменении выбранных дней
	useEffect(() => {
		setDays(arrayDays.length);
	}, [arrayDays, setDays]);

	// Генерация календаря
	const date = dayjs(); // Текущая дата
	const daysInMonth = date.daysInMonth(); // Количество дней в текущем месяце
	const firstDayOfMonth = date.startOf("month").day(); // День недели первого дня месяца
	const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Корректировка для понедельника

	return (
		<div>
			<h2 className='text-lg font-semibold mb-4'>Количество дней: {days}</h2>
			<input
				type='number'
				value={days} // Привязываем значение к состоянию days
				onChange={handleChange} // Обрабатываем изменения
				className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
				min={0} // Ограничиваем ввод только положительными числами
			/>
			<div className='mt-4'>
				<h3 className='text-md font-semibold mb-2'>Выбранные дни:</h3>
				<ul className='list-disc list-inside'>
					{arrayDays.map(day => (
						<li key={day}>День {day}</li>
					))}
				</ul>
			</div>
		</div>
	);
};
