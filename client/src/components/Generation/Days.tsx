"use client";
import { daysArrayAtom } from "@/jotai/days";
import { daysAtom } from "@/jotai/schedule";
import { useAtom } from "jotai";
import { useEffect } from "react";

export const Days = () => {
	// Используем useAtom для управления состоянием days и daysArray
	const [days, setDays] = useAtom(daysAtom);
	const [daysArray, setDaysArray] = useAtom(daysArrayAtom);

	// Обработчик изменения значения в поле ввода
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value, 10); // Преобразуем строку в число
		setDays(isNaN(value) ? 0 : value); // Если ввод не число, устанавливаем 0
	};

	// Эффект для обновления daysArray при изменении days
	useEffect(() => {
		// Создаем массив дней от 1 до days
		const newDaysArray = Array.from({ length: days }, (_, index) => index + 1);
		setDaysArray(newDaysArray);
	}, [days, setDaysArray]);

	return (
		<>
			<h2 className='text-lg font-semibold mb-4'>Количество дней: {days}</h2>
			<input
				type='number'
				value={days} // Привязываем значение к состоянию days
				onChange={handleChange} // Обрабатываем изменения
				className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
				min={0} // Ограничиваем ввод только положительными числами
			/>
			<div className='mt-4'>
				<h3 className='text-md font-semibold mb-2'>Массив дней:</h3>
				<ul className='list-disc list-inside'>
					{daysArray.map((day: any) => (
						<li key={day}>День {day}</li>
					))}
				</ul>
			</div>
		</>
	);
};
