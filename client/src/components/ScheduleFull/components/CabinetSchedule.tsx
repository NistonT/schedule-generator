type Props = {
	cabinets: string[];
};

export const CabinetSchedule = ({ cabinets }: Props) => {
	return (
		<>
			<div className='flex items-center gap-2'>
				<span className='text-sm font-medium text-gray-500'>Кабинеты:</span>
				<div className='flex flex-wrap gap-2'>
					{cabinets.map((cabinet, idx) => (
						<span
							key={idx}
							className='px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium'
						>
							{cabinet}
						</span>
					))}
				</div>
			</div>
		</>
	);
};
