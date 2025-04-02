type Props = {
	CreatedAt: string;
	UpdatedAt: string;
};

export const ScheduleData = ({ CreatedAt, UpdatedAt }: Props) => {
	return (
		<>
			<div className='mt-4 text-sm text-gray-500'>
				<span>Создано: {new Date(CreatedAt).toLocaleString()}</span>
				<span className='mx-2'>•</span>
				<span>Обновлено: {new Date(UpdatedAt).toLocaleString()}</span>
			</div>
		</>
	);
};
