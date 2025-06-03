import { LucideIcon } from "lucide-react";
import { m } from "motion/react";

type Props = {
	title: string;
	icon: LucideIcon;
	onClick?: () => void;
	className?: string;
};

export const ButtonArrow = ({
	title,
	icon: Icon,
	className,
	onClick,
}: Props) => {
	return (
		<m.button
			whileTap={{ scale: 0.95 }}
			type='submit'
			className={`w-full px-3 py-1.5 rounded-md bg-gray-950 text-white hover:bg-gray-800 transition-colors relative ${className}`}
			onClick={onClick}
		>
			<Icon size={20} />
			{title}
		</m.button>
	);
};
