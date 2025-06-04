import { SetStateAction } from "react";

type Props = {
	setShowChecked: (value: SetStateAction<boolean>) => void;
	showChecked: boolean;
	showUnchecked: boolean;
	setShowUnchecked: (value: SetStateAction<boolean>) => void;
};

export const FilterControlButtons = ({
	setShowChecked,
	showChecked,
	showUnchecked,
	setShowUnchecked,
}: Props) => {
	return (
		<>
			{/* Кнопки управления фильтрами */}
			<div className='flex items-center gap-4'>
				<button
					onClick={() => setShowChecked(prev => !prev)}
					className={`px-3 py-2 text-sm rounded ${
						showChecked ? "bg-gray-950 text-white" : "bg-gray-200 text-gray-700"
					}`}
				>
					{showChecked ? "Скрыть проверенные" : "Показать проверенные"}
				</button>
				<button
					onClick={() => setShowUnchecked(prev => !prev)}
					className={`px-3 py-2 text-sm rounded ${
						showUnchecked
							? "bg-gray-950 text-white"
							: "bg-gray-200 text-gray-700"
					}`}
				>
					{showUnchecked ? "Скрыть непроверенные" : "Показать непроверенные"}
				</button>
			</div>
		</>
	);
};
