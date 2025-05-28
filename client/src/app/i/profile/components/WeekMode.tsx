import { ViewMode } from "@/jotai/viewModeAtom";
import { Dayjs } from "dayjs";
import { m } from "motion/react";

type Props = {
	viewMode: ViewMode;
	date: Dayjs;
	isAllSelected: (dates: string[]) => boolean;
	getWeekDates: (startDate: Dayjs) => string[];
	handleWeekClick: (weekStartDate: Dayjs) => void;
};

export const WeekMode = ({
	viewMode,
	date,
	isAllSelected,
	getWeekDates,
	handleWeekClick,
}: Props) => {
	return (
		<>
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
							<m.div
								key={weekIndex}
								onClick={() => handleWeekClick(startWeekDay)}
								className={`p-3 border rounded-lg shadow-sm bg-white text-gray-950 cursor-pointer ${
									allSelected
										? "bg-gray-200 border-gray-950"
										: "hover:bg-gray-50 border-gray-200"
								}`}
								initial={{ scale: 1 }}
								whileTap={{ scale: 0.98 }}
								transition={{ type: "spring", stiffness: 300 }}
							>
								Неделя {weekIndex + 1} — {startWeekDay.format("D")} –{" "}
								{endWeekDay.format("D MMM")}
							</m.div>
						);
					})}
				</div>
			)}
		</>
	);
};
