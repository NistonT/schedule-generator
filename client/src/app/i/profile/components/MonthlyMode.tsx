import { ViewMode } from "@/jotai/viewModeAtom";
import { IMonthItem } from "@/types/schedule.type";
import { Dayjs } from "dayjs";
import { motion } from "framer-motion";

type Props = {
	viewMode: ViewMode;
	months: IMonthItem[];
	date: Dayjs;
	arrayDays: string[];
	handleMonthClick: (monthIndex: number) => void;
	isAllSelected: (dates: string[]) => boolean;
	getMonthDates: (monthDate: Dayjs) => string[];
};

export const MonthlyMode = ({
	viewMode,
	months,
	date,
	arrayDays,
	handleMonthClick,
	isAllSelected,
	getMonthDates,
}: Props) => {
	return (
		<>
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
										? "bg-gray-200 border-gray-950"
										: "hover:bg-gray-50 border-gray-200"
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
		</>
	);
};
