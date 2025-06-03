import { Calendar, Clock } from "lucide-react";
import { m } from "motion/react";

type Props = {
	CreatedAt: string;
	UpdatedAt: string;
};

export const ScheduleData = ({ CreatedAt, UpdatedAt }: Props) => {
	return (
		<m.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className='mt-4 text-sm text-gray-500 space-y-2'
		>
			<div className='flex items-center gap-2'>
				<Calendar className='w-4 h-4 text-gray-400' />
				<span>Создано: {new Date(CreatedAt).toLocaleString()}</span>
			</div>
			<div className='flex items-center gap-2'>
				<Clock className='w-4 h-4 text-gray-400' />
				<span>Обновлено: {new Date(UpdatedAt).toLocaleString()}</span>
			</div>
		</m.div>
	);
};
