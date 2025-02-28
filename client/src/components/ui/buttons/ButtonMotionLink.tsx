"use client";
import { m } from "motion/react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

type Props = {
	href: string;
	title: string;
	icon?: ReactNode;
	target?: string;
	className?: string;
	indexButton?: number;
};

export const ButtonMotionLink = ({
	href,
	title,
	icon,
	target,
	className,
	indexButton = 0,
}: Props) => {
	const { push } = useRouter();

	return (
		<m.div
			initial={{
				opacity: 0,
				y: -20,
			}}
			animate={{
				opacity: 1,
				y: 0,
			}}
			transition={{
				duration: 1,
				delay: indexButton * 0.5,
			}}
			whileInView={{
				y: 0,
				opacity: 1,
			}}
			viewport={{ once: false }}
			className={`px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-md shadow-md hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 flex items-center gap-3 ${className}`}
			onClick={event => {
				setTimeout(() => {
					push(href);
				}, 1000);
			}}
		>
			{icon}
			{title}
		</m.div>
	);
};
