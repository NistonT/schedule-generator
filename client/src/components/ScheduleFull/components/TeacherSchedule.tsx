import { TypeTeachers } from "@/types/schedule.types";

type Props = {
	teachers: TypeTeachers[];
};

export const TeacherSchedule = ({ teachers }: Props) => {
	return (
		<>
			<div className='flex items-center gap-2'>
				<span className='text-sm font-medium text-gray-500'>
					Преподаватели:
				</span>
				<div className='flex flex-wrap gap-2'>
					{teachers.map(teacher => (
						<span
							key={teacher.tid}
							className='px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium'
						>
							{teacher.name}
						</span>
					))}
				</div>
			</div>
		</>
	);
};
