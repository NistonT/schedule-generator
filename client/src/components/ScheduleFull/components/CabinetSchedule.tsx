import { MapPin } from "lucide-react";
import { m } from "motion/react";

type Props = {
	cabinets: string[];
};

export const CabinetSchedule = ({ cabinets }: Props) => {
	return (
		<>
			<m.div
				variants={{
					hidden: { opacity: 0, y: 10 },
					visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
				}}
				initial='hidden'
				animate='visible'
				className='flex items-center gap-4 p-4 bg-white rounded-lg shadow-md border border-gray-100'
			>
				{/* Иконка и заголовок */}
				<div className='flex items-center gap-2 text-gray-500'>
					<MapPin size={18} />
					<span className='text-sm font-medium'>Кабинеты:</span>
				</div>

				{/* Список кабинетов */}
				<div className='flex flex-wrap gap-2'>
					{cabinets.map((cabinet, idx) => (
						<m.span
							key={idx}
							variants={{
								hidden: { opacity: 0, y: 10 },
								visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
							}}
							className='px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium'
						>
							{cabinet}
						</m.span>
					))}
				</div>
			</m.div>
		</>
	);
};
