"use client";

import { ReactNode } from "react";

export enum EnumTypeButton {
	SUBMIT = "submit",
	BUTTON = "button",
}

type Props = {
	title: string;
	icon?: ReactNode;
	onClick?: (event: any) => void;
	className?: string;
	type?: EnumTypeButton;
};

export const ButtonSubmit = ({
	title,
	icon,
	onClick,
	className,
	type = EnumTypeButton.SUBMIT,
}: Props) => {
	return (
		<button
			type={type}
			className={`flex items-center justify-center w-full px-4 py-2 text-white border-2 border-gray-950 bg-gray-950 hover:bg-white hover:text-gray-950 rounded-md transition-all duration-300 gap-2 cursor-pointer ${className}`}
			onClick={onClick}
		>
			<div className='flex-shrink-0'>{icon}</div>
			{title}
		</button>
	);
};
