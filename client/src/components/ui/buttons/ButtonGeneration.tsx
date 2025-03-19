import { ReactNode } from "react";

type Props = {
	title: string;
	icon?: ReactNode;
};

export const ButtonGeneration = ({ title, icon }: Props) => {
	return (
		<button
			type='submit'
			className='mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700'
		>
			{icon}
			{title}
		</button>
	);
};
