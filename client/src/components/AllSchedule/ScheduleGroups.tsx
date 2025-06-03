import { ArrowDown, ArrowUp } from "lucide-react";
import { m } from "motion/react";
import { useState } from "react";
import { ButtonArrow } from "../ui/buttons/ButtonArrow";

type Props = {
	groups: string[];
};

export const ScheduleGroups = ({ groups }: Props) => {
	const [showAll, setShowAll] = useState(false);

	const visibleGroups = showAll ? groups : groups.slice(0, 3);
	const hasMore = groups.length > 3;

	return (
		<m.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className='bg-gray-50 p-4 rounded-lg'
		>
			<h3 className='font-medium text-gray-700 mb-2'>Группы</h3>

			{hasMore && (
				<ButtonArrow
					title={showAll ? "Скрыть" : "Показать"}
					icon={showAll ? ArrowUp : ArrowDown}
					onClick={() => setShowAll(!showAll)}
					className='flex items-center'
				/>
			)}

			<div className='flex flex-wrap gap-2 mt-2'>
				{visibleGroups.map((group: string) => (
					<span
						key={group}
						className='bg-green-100 text-gray-950 text-sm px-2 py-1 rounded'
					>
						{group}
					</span>
				))}
				{hasMore && !showAll && (
					<span className='text-gray-500 text-sm px-2 py-1'>…</span>
				)}
			</div>
		</m.div>
	);
};
