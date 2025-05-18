type Props = {
	groups: string[];
};

export const ScheduleGroups = ({ groups }: Props) => {
	return (
		<div className='bg-gray-50 p-4 rounded-lg'>
			<h3 className='font-medium text-gray-700 mb-2'>Группы</h3>
			<div className='flex flex-wrap gap-2'>
				{groups.map((group: string) => (
					<span
						key={group}
						className='bg-green-100 text-gray-950 text-sm px-2 py-1 rounded'
					>
						{group}
					</span>
				))}
			</div>
		</div>
	);
};
