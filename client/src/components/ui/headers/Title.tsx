"use client";

type Props = {
	title: string;
};

export const Title = ({ title }: Props) => {
	return (
		<div className='relative rounded-lg text-gray-950 font-bold text-2xl'>
			<span className='block'>{title}</span>
		</div>
	);
};
