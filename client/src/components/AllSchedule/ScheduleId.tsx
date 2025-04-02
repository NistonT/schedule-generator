type Props = {
	index: number;
	id: string;
};

export const ScheduleId = ({ index, id }: Props) => {
	return (
		<div className='flex justify-between items-start'>
			<h2 className='text-xl font-bold text-gray-800'>
				Расписание #{index + 1}
			</h2>
			<span className='inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full'>
				ID: {id}
			</span>
		</div>
	);
};
