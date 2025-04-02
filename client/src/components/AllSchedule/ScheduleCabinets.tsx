type Props = {
	cabinets: string[];
};

export const ScheduleCabinets = ({ cabinets }: Props) => {
	return (
		<div className='bg-gray-50 p-4 rounded-lg'>
			<h3 className='font-medium text-gray-700 mb-2'>Кабинеты</h3>
			<div className='flex flex-wrap gap-2'>
				{cabinets.map((cabinet: string) => (
					<span
						key={cabinet}
						className='bg-purple-100 text-purple-800 text-sm px-2 py-1 rounded'
					>
						{cabinet}
					</span>
				))}
			</div>
		</div>
	);
};
