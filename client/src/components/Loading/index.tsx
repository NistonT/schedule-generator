export const Loading = () => {
	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-white'>
			<div className='flex flex-col items-center'>
				<span className='loading loading-infinity w-32 h-32 text-indigo-500'></span>
			</div>
		</div>
	);
};
