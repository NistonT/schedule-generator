"use client";

import { ReactNode } from "react";

type Props = {
	title: string;
	icon?: ReactNode;
	onClick?: () => void;
	className?: string;
};

export const ButtonSubmit = ({ title, icon, onClick, className }: Props) => {
	return (
		<button
			type='submit'
			className={`flex items-center justify-center w-full px-4 py-2 text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-md shadow-md hover:from-indigo-700 hover:to-blue-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 gap-2 cursor-pointer ${className}`}
			onClick={onClick}
		>
			<div className='flex-shrink-0'>{icon}</div>
			{title}
		</button>
	);
};
