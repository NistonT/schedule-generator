"use client";
import { groupsAtom, hoursAtom } from "@/jotai/schedule";
import { useAtom } from "jotai";

export const Hours = () => {
	const [hours, setHours] = useAtom(hoursAtom);
	const [groups, setGroups] = useAtom(groupsAtom);

	// Обработчик изменения количества часов для подгруппы
	const handleHoursChange = (
		group: string,
		subgroupIndex: number,
		value: number
	) => {
		setHours(prev => {
			const updatedHours = { ...prev };
			if (!updatedHours[group]) {
				updatedHours[group] = [0, 0]; // Инициализируем массив, если группы нет
			}
			updatedHours[group][subgroupIndex] = value; // Обновляем значение
			return updatedHours;
		});
	};

	return (
		<div className='mt-4'>
			<h2 className='text-lg font-semibold mb-4'>Часы по подгруппам</h2>
			{groups.map(group => (
				<div key={group} className='mb-4'>
					<h3 className='text-md font-medium mb-2'>Группа: {group}</h3>
					<div className='flex gap-4'>
						<div>
							<label
								htmlFor={`${group}-subgroup-1`}
								className='block text-sm font-medium text-gray-700'
							>
								Первая подгруппа
							</label>
							<input
								id={`${group}-subgroup-1`}
								type='number'
								value={hours[group]?.[0] || 0} // Значение по умолчанию 0
								onChange={e =>
									handleHoursChange(group, 0, parseInt(e.target.value, 10))
								}
								className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
								min={0} // Ограничиваем ввод только положительными числами
							/>
						</div>
						<div>
							<label
								htmlFor={`${group}-subgroup-2`}
								className='block text-sm font-medium text-gray-700'
							>
								Вторая подгруппа
							</label>
							<input
								id={`${group}-subgroup-2`}
								type='number'
								value={hours[group]?.[1] || 0} // Значение по умолчанию 0
								onChange={e =>
									handleHoursChange(group, 1, parseInt(e.target.value, 10))
								}
								className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
								min={0} // Ограничиваем ввод только положительными числами
							/>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};
