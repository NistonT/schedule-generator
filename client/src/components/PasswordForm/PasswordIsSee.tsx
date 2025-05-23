type Props = {
	isSee: boolean;
};

export const PasswordIsSee = ({ isSee }: Props) => {
	return (
		<>
			{isSee ? (
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					stroke-width='2'
					stroke-linecap='round'
					stroke-linejoin='round'
					className='w-6 h-6'
				>
					<path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'></path>
					<circle cx='12' cy='12' r='3'></circle>
				</svg>
			) : (
				<div>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
						className='w-6 h-6'
					>
						<path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'></path>
					</svg>
				</div>
			)}
		</>
	);
};
