import { ViewMode } from "@/jotai/viewModeAtom";
import dayjs from "dayjs";
import { m } from "motion/react";

type Props = {
	viewMode: ViewMode;
	excludedDaysOfWeek: Set<number>;
	adjustedFirstDay: number;
	daysInMonth: number;
	date: dayjs.Dayjs;
	arrayDays: string[];
	handleMouseDown: (e: React.MouseEvent, day: number) => void;
	handleMouseEnter: (day: number) => void;
	handleRightClick: (e: React.MouseEvent, day: number) => void;
};

export const DayMode = ({
	viewMode,
	excludedDaysOfWeek,
	adjustedFirstDay,
	daysInMonth,
	date,
	arrayDays,
	handleMouseDown,
	handleMouseEnter,
	handleRightClick,
}: Props) => {
	return (
		<>
			{/* Режим дней */}
			{viewMode === "day" && (
				<>
					{/* Дни недели */}
					<div className='grid grid-cols-7 gap-2'>
						{["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map(
							(dayName, index) => {
								const realDayOfWeek = index === 6 ? 0 : index + 1;

								return (
									<div
										key={dayName}
										className={`text-center text-sm font-medium ${
											excludedDaysOfWeek.has(realDayOfWeek)
												? "text-gray-950 font-semibold"
												: "text-gray-500"
										}`}
									>
										{dayName}
									</div>
								);
							}
						)}
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
								<m.div
									key={day}
									onMouseDown={e => handleMouseDown(e, day)}
									onMouseEnter={() => handleMouseEnter(day)}
									onContextMenu={e => e.preventDefault()}
									onClick={e => handleRightClick(e, day)}
									className={`p-2 text-center border-2 rounded-lg shadow-sm flex items-center justify-center text-2xl cursor-pointer select-none ${
										isPastDate
											? "bg-gray-50 text-gray-300 cursor-not-allowed"
											: isSelected
											? "!bg-gray-200 !text-gray-950 border-gray-500"
											: isExcluded
											? "bg-gray-100 text-gray-400"
											: "bg-white text-gray-950 hover:bg-gray-50"
									} ${
										isToday
											? "border-gray-950 bg-gray-50 font-bold"
											: "border-gray-200"
									}`}
									initial={{ scale: 1 }}
									whileHover={!isExcluded ? { scale: 1.05 } : {}}
									whileTap={!isExcluded ? { scale: 0.95 } : {}}
								>
									{day}
								</m.div>
							);
						})}
					</div>
				</>
			)}
		</>
	);
};
