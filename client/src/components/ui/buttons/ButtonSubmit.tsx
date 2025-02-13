"use client";

type Props = {
	title: string;
};

export const ButtonSubmit = ({ title }: Props) => {
	return (
		<button
			type='submit'
			className='px-4 py-2 w-full text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-md shadow-md hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300'
		>
			{title}
		</button>
	);
};
