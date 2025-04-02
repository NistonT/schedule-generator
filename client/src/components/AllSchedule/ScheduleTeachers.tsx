import { TypeTeachers } from "@/types/schedule.types";

type Props = {
	teachers: TypeTeachers[];
};

export const ScheduleTeachers = ({ teachers }: Props) => {
	return (
		<>
			<div className='bg-gray-50 p-4 rounded-lg'>
				<h3 className='font-medium text-gray-700 mb-2'>Преподаватели</h3>
				<div className='flex flex-wrap gap-2'>
					{teachers && teachers.length > 0 ? (
						teachers.map(teacher => (
							<span
								key={teacher.tid}
								className='bg-yellow-100 text-yellow-800 text-sm px-2 py-1 rounded'
							>
								{teacher.name}
							</span>
						))
					) : (
						<span className='text-gray-500 text-sm'>Нет преподавателей</span>
					)}
				</div>
			</div>
		</>
	);
};
