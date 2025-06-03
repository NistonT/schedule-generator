import { ClipboardList } from "lucide-react";
import { m } from "motion/react";

type Props = {
	index: number;
	id: string;
};

export const ScheduleId = ({ index, id }: Props) => {
	return (
		<m.div
			initial={{ opacity: 0, y: 5 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.2 }}
			className='flex justify-between items-start mb-4'
		>
			<div className='flex items-center gap-3'>
				<ClipboardList className='w-6 h-6 text-gray-500' />
				<h2 className='text-xl font-bold text-gray-950'>
					Расписание #{index + 1}
				</h2>
			</div>
			<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-950'>
				ID: {id}
			</span>
		</m.div>
	);
};
