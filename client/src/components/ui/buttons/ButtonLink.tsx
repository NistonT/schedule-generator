import Link from "next/link";
import { ReactNode } from "react";

type Props = {
	href: string;
	title: string;
	icon?: ReactNode;
	target?: string;
	onClick?: () => void;
	className?: string;
};

export const ButtonLink = ({
	href,
	title,
	icon,
	target,
	onClick,
	className,
}: Props) => {
	return (
		<Link
			href={href}
			target={target}
			className={`px-4 py-2 text-sm font-medium text-white bg-gray-950 rounded-md shadow-md transition-all duration-300 flex items-center gap-3 ${className}`}
			onClick={onClick}
		>
			{icon}
			{title}
		</Link>
	);
};
