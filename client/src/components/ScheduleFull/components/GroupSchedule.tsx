type Props = {
	groups: string[];
};

export const GroupSchedule = ({ groups }: Props) => {
	return (
		<>
			<div className='flex items-center gap-2'>
				<span className='text-sm font-medium text-gray-500'>Группы:</span>
				<div className='flex flex-wrap gap-2'>
					{groups.map((group, idx) => (
						<span
							key={idx}
							className='px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium'
						>
							{group}
						</span>
					))}
				</div>
			</div>
		</>
	);
};
