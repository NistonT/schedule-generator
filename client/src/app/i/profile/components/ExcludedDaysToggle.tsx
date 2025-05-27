"use client";

import { ButtonMotion } from "@/components/ui/buttons/ButtonMotion";
import { dayIcons, dayNames, realDayIndex } from "@/constants/days.constants";
import { excludedDaysOfWeekAtom } from "@/jotai/viewModeAtom";
import { motion } from "framer-motion";
import { useAtomValue, useSetAtom } from "jotai";

export const ExcludedDaysToggle = () => {
	const excludedDays = useAtomValue(excludedDaysOfWeekAtom);
	const setExcludedDays = useSetAtom(excludedDaysOfWeekAtom);

	const toggleDay = (displayIndex: number) => {
		const realIndex = realDayIndex[displayIndex];
		setExcludedDays(prev => {
			const newSet = new Set(prev);
			if (newSet.has(realIndex)) {
				newSet.delete(realIndex);
			} else {
				newSet.add(realIndex);
			}
			return newSet;
		});
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			className='p-4'
		>
			<h3 className='font-medium text-gray-700'>Исключить дни недели:</h3>

			<div className='flex flex-wrap gap-2'>
				{dayNames.map((dayName, displayIndex) => {
					const realIndex = realDayIndex[displayIndex];
					const isSelected = excludedDays.has(realIndex);
					const DayIcon = dayIcons[displayIndex];

					return (
						<>
							<ButtonMotion
								key={displayIndex}
								onClick={() => toggleDay(displayIndex)}
								title={dayName}
								icon={DayIcon}
								className={`${
									isSelected
										? "bg-gray-950 text-white"
										: " bg-white text-gray-950 border"
								}`}
							/>
						</>
					);
				})}
			</div>
		</motion.div>
	);
};
