import { TypeTeachers } from "@/types/schedule.type";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";
import { ButtonArrow } from "../ui/buttons/ButtonArrow";

type Props = {
	teachers: TypeTeachers[];
};

export const ScheduleTeachers = ({ teachers }: Props) => {
	const [showAll, setShowAll] = useState(false);

	const visibleTeachers = showAll
		? teachers || []
		: (teachers || []).slice(0, 3);

	const hasMore = (teachers?.length || 0) > 3;

	return (
		<div className='bg-gray-50 p-4 rounded-lg'>
			<h3 className='font-medium text-gray-700 mb-2'>Преподаватели</h3>

			{teachers?.length === 0 ? (
				<span className='text-gray-500 text-sm'>Нет преподавателей</span>
			) : (
				<>
					{hasMore && (
						<ButtonArrow
							title={showAll ? "Скрыть" : "Показать"}
							icon={showAll ? ArrowUp : ArrowDown}
							onClick={() => setShowAll(!showAll)}
							className='flex items-center'
						/>
					)}

					<div className='flex flex-wrap gap-2 mt-2'>
						{visibleTeachers.map(teacher => (
							<span
								key={teacher.tid}
								className='bg-red-100 text-gray-950 text-sm px-2 py-1 rounded'
							>
								{teacher.name}
							</span>
						))}
						{hasMore && !showAll && (
							<span className='text-gray-500 text-sm px-2 py-1'>…</span>
						)}
					</div>
				</>
			)}
		</div>
	);
};
