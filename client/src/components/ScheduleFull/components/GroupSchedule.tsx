import { Users } from "lucide-react";
import { m } from "motion/react";

type Props = {
	groups: string[];
};

export const GroupSchedule = ({ groups }: Props) => {
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
					<Users size={18} />
					<span className='text-sm font-medium'>Группы:</span>
				</div>

				{/* Список групп */}
				<div className='flex flex-wrap gap-2'>
					{groups.map((group, idx) => (
						<m.span
							key={idx}
							variants={{
								hidden: { opacity: 0, y: 10 },
								visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
							}}
							className='px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors'
						>
							{group}
						</m.span>
					))}
				</div>
			</m.div>
		</>
	);
};
