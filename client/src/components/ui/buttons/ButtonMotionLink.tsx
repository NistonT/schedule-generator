"use client";
import { AnimatePresence, m } from "motion/react";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";

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
	const [isClicked, setIsClicked] = useState<boolean>(false);
	const { push } = useRouter();

	return (
		<div className='relative inline-block'>
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
					duration: 0.2,
					delay: indexButton * 0.5,
				}}
				whileInView={{
					y: 0,
					opacity: 1,
				}}
				whileDrag={{
					backgroundColor: "red",
				}}
				viewport={{ once: false }}
				className={`px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-md shadow-md hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 flex items-center gap-3 cursor-pointer relative ${className}`}
				onClick={event => {
					setIsClicked(true);

					setTimeout(() => {
						push(href);
					}, 0);
				}}
			>
				{icon}
				{title}
				<AnimatePresence>
					{isClicked && (
						<m.div
							layout
							initial={{
								opacity: 1,
							}}
							transition={{
								duration: 1,
							}}
							className={`px-4 py-2 text-sm font-medium text-transparent bg-gradient-to-r from-indigo-700 to-blue-700 rounded-md shadow-md  transition-all duration-300 flex items-center gap-3 cursor-pointer z-50 overflow-hidden absolute w-full ${className} -ml-4 pr-8`}
						>
							<m.span
								animate={{
									x: `${100}%`,
									className: "bg-gradient-to-r from-indigo-700 to-blue-700",
								}}
								transition={{
									duration: 1,
									ease: "easeInOut",
								}}
								className='text-white w-full relative'
							>
								{icon}
							</m.span>
						</m.div>
					)}
				</AnimatePresence>
			</m.div>
		</div>
	);
};
