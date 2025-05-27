"use client";

import { LucideIcon } from "lucide-react";
import { m } from "motion/react";

type Props = {
	onClick?: () => void;
	icon: LucideIcon;
};

export const ButtonIcon = ({ onClick, icon: Icon }: Props) => {
	return (
		<m.button
			whileTap={{ scale: 0.95 }}
			onClick={onClick}
			className='px-3 py-1.5 rounded-md bg-gray-950 text-white hover:bg-gray-800 transition-colors relative'
			type='button'
		>
			<Icon size={20} />
		</m.button>
	);
};
