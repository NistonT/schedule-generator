import { TypeTeachers } from "@/types/schedule.type";
import { User } from "lucide-react";
import { m } from "motion/react";

type Props = {
	teachers: TypeTeachers[];
};

export const TeacherSchedule = ({ teachers }: Props) => {
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
					<User size={18} />
					<span className='text-sm font-medium'>Преподаватели:</span>
				</div>

				{/* Список преподавателей */}
				<div className='flex flex-wrap gap-2'>
					{teachers.map(teacher => (
						<m.span
							key={teacher.tid}
							variants={{
								hidden: { opacity: 0, y: 10 },
								visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
							}}
							className='px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium hover:bg-green-200 transition-colors'
						>
							{teacher.name}
						</m.span>
					))}
				</div>
			</m.div>
		</>
	);
};
