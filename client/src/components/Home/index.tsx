"use client";
import { motion, Variants } from "motion/react";
import { Nav } from "./Nav";

import { useMemo } from "react";
import { Steps } from "./Steps";
import { Title } from "./Title";
import { Web } from "./Web";

export const Home = () => {
	const points = useMemo(
		() =>
			Array.from({ length: 40 }, (_, i) => ({
				id: i,
				angle: (i * 360) / 40,
			})),
		[]
	);

	const dotVariants: Variants = {
		hidden: { opacity: 0, scale: 0 },
		visible: (i: number) => ({
			opacity: 1,
			scale: 1,
			transition: {
				delay: i * 0.02,
				duration: 0.8,
				repeat: Infinity,
				repeatType: "mirror" as const,
				ease: "easeInOut",
			},
		}),
	};

	const circleVariants: Variants = {
		hidden: { scale: 0.8, opacity: 0 },
		visible: {
			scale: 1,
			opacity: 1,
			transition: {
				duration: 1.5,
				repeat: Infinity,
				repeatType: "mirror" as const,
				ease: "easeInOut",
			},
		},
	};
	return (
		<>
			<div className='bg-white flex flex-col items-center justify-center min-h-screen w-full overflow-hidden'>
				<motion.div
					className='relative w-full h-[60vh] flex items-center justify-center bg-white mt-16'
					initial='hidden'
					animate='visible'
				>
					<motion.div
						className='w-96 h-96 bg-indigo-500/20 rounded-full absolute border-2 border-indigo-400/30'
						variants={circleVariants}
					/>

					{points.map((point, i) => {
						const angleInRad = (point.angle * Math.PI) / 180;
						const radius = 180;

						return (
							<motion.div
								key={point.id}
								className='absolute w-2 h-2 bg-indigo-400 rounded-full'
								style={{
									x: radius * Math.cos(angleInRad),
									y: radius * Math.sin(angleInRad),
								}}
								variants={dotVariants}
								custom={i}
							/>
						);
					})}

					<motion.div
						className='absolute w-48 h-48 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/30'
						animate={{
							scale: [1, 1.2, 1],
							opacity: [0.8, 1, 0.8],
						}}
						transition={{
							duration: 2,
							repeat: Infinity,
							repeatType: "mirror" as const,
							ease: "easeInOut",
						}}
					/>
				</motion.div>

				<div className='mt-4 flex-1'>
					<Title />
					<Nav />
				</div>

				<section className='text-gray-600 body-font w-full flex-1'>
					<Steps />
					<Web />
				</section>
			</div>
		</>
	);
};
