"use client";
import { maxLoadAtom } from "@/jotai/schedule";
import { useAtom } from "jotai";
import { useEffect } from "react";

export const MaxLoad = () => {
	const [maxLoad, setMaxLoad] = useAtom(maxLoadAtom);

	// Устанавливаем начальное значение 6
	useEffect(() => {
		setMaxLoad(6);
	}, [setMaxLoad]);

	// Обработчик изменения значения в поле ввода
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value, 10); // Преобразуем строку в число
		setMaxLoad(isNaN(value) ? 0 : value); // Если ввод не число, устанавливаем 0
	};

	return (
		<div className='mt-4'>
			<label
				htmlFor='max-load-input'
				className='block text-sm font-medium text-gray-700'
			>
				Максимальная нагрузка
			</label>
			<input
				id='max-load-input'
				type='number'
				value={maxLoad} // Привязываем значение к состоянию maxLoad
				onChange={handleChange} // Обрабатываем изменения
				className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
				min={0} // Ограничиваем ввод только положительными числами
			/>
		</div>
	);
};
