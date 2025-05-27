"use client";

import { ButtonIcon } from "@/components/ui/buttons/ButtonIcon";
import { ViewMode } from "@/jotai/viewModeAtom";
import dayjs from "dayjs";
import { Minus, Plus, Trash2 } from "lucide-react";
import { m } from "motion/react";

type Props = {
	zoomIn: () => void;
	zoomOut: () => void;
	viewMode: ViewMode;
	date: dayjs.Dayjs;
	onClear: (() => void) | undefined;
};

export const ScaleControl = ({
	zoomIn,
	zoomOut,
	viewMode,
	date,
	onClear,
}: Props) => {
	return (
		<m.div
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			className='mb-6 p-4 bg-white rounded-xl shadow-md border border-gray-200 relative'
		>
			{/* Заголовок и кнопки управления */}
			<div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative'>
				{/* Навигация по масштабу */}
				<div className='flex items-center gap-2 relative'>
					<ButtonIcon icon={Plus} onClick={zoomOut} />
					<ButtonIcon icon={Minus} onClick={zoomIn} />
				</div>

				{/* Заголовок месяца или года */}
				<div className='absolute left-1/2 transform -translate-x-1/2 text-center'>
					<h3 className='text-xl font-semibold text-gray-800'>
						{viewMode === "month"
							? date.format("YYYY")
							: date.format("MMMM YYYY")}
					</h3>
				</div>

				{/* Кнопка очистки */}
				<ButtonIcon icon={Trash2} onClick={onClear} />
			</div>
		</m.div>
	);
};
