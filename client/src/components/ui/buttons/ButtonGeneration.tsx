import { ReactNode } from "react";

type Props = {
	title: string;
	icon?: ReactNode;
};

export const ButtonGeneration = ({ title, icon }: Props) => {
	return (
		<button
			type='submit'
			className='mt-4 bg-gray-950 text-white px-4 py-2 rounded-md'
		>
			{icon}
			{title}
		</button>
	);
};
