import { LucideIcon } from "lucide-react";
import { m } from "motion/react";

type Props = {
	title: string;
	icon: LucideIcon;
	onClick?: () => void;
	className?: string;
	iconLeft?: boolean;
};

export const ButtonMotionNavigation = ({
	title,
	icon: Icon,
	className,
	onClick,
	iconLeft = true,
}: Props) => {
	return (
		<m.button
			whileTap={{ scale: 0.95 }}
			type='submit'
			className={`mt-4 px-4 py-2 rounded-md flex items-center ${className}`}
			onClick={onClick}
		>
			{iconLeft ? (
				<>
					<Icon size={20} />
					{title}
				</>
			) : (
				<>
					{title}
					<Icon size={20} />
				</>
			)}
		</m.button>
	);
};
