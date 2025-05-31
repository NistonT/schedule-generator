import { TypeCabinetLimits } from "@/types/schedule.type";
import { ChevronsDown, ChevronsUp, X } from "lucide-react";
import { m } from "motion/react";
import { SetStateAction } from "react";

type Props = {
	filteredLimits: TypeCabinetLimits[];
	setShowAll: (value: SetStateAction<boolean>) => void;
	showAll: boolean;
	displayedLimits: TypeCabinetLimits[];
	handleRemoveCabinetLimit: (tid: number) => void;
	getTeacherName: (tid: number) => string;
	searchTerm: string;
};

export const Restrictions = ({
	filteredLimits,
	setShowAll,
	showAll,
	displayedLimits,
	handleRemoveCabinetLimit,
	getTeacherName,
	searchTerm,
}: Props) => {
	return (
		<>
			{/* Список текущих ограничений */}
			<div className='mb-6'>
				{/* Кнопка показать всё / скрыть */}
				{filteredLimits.length > 3 && (
					<button
						type='button'
						onClick={() => setShowAll(!showAll)}
						className='mt-3 flex items-center gap-1 text-sm text-gray-950 hover:underline focus:outline-none'
					>
						{showAll ? (
							<>
								<ChevronsUp className='w-4 h-4' /> Скрыть
							</>
						) : (
							<>
								<ChevronsDown className='w-4 h-4' /> Показать все
							</>
						)}
					</button>
				)}
				<div className='flex flex-wrap gap-2'>
					{displayedLimits.length > 0 ? (
						displayedLimits.map(record => (
							<m.div
								key={record.tid}
								initial={{ scale: 0.95, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.9, opacity: 0 }}
								className='px-3 py-1 bg-blue-100 text-gray-950 rounded-full flex items-center gap-1 group cursor-pointer hover:bg-blue-200 transition-colors'
								onClick={() => handleRemoveCabinetLimit(record.tid)}
							>
								<span>
									Преподаватель: {getTeacherName(record.tid)}, Кабинеты:{" "}
									{record.cabinets.join(", ")}
								</span>
								<X className='w-4 h-4 opacity-70 group-hover:opacity-100' />
							</m.div>
						))
					) : (
						<p className='text-sm text-gray-500 dark:text-gray-400 italic'>
							{searchTerm ? "Ничего не найдено" : "Нет добавленных ограничений"}
						</p>
					)}
				</div>
			</div>
		</>
	);
};
