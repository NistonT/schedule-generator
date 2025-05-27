import { LucideIcon } from "lucide-react";
import { m } from "motion/react";

type Props = {
	title: string;
	icon: LucideIcon;
	onClick?: () => void;
	className?: string;
};

export const ButtonMotion = ({
	title,
	icon: Icon,
	className,
	onClick,
}: Props) => {
	return (
		<m.button
			whileTap={{ scale: 0.95 }}
			type='submit'
			className={`mt-4 px-4 py-2 rounded-md ${className}`}
			onClick={onClick}
		>
			<Icon size={20} />
			{title}
		</m.button>
	);
};
