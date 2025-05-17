"use client";
import { navigationMainPage } from "@/constants/navigation.constants";
import { m, Variants } from "motion/react";
import { useMemo } from "react";
import { ButtonMotionLink } from "../ui/buttons/ButtonMotionLink";

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
				<div className='absolute right-0 top-16 w-screen h-screen pointer-events-none md:top-0 md:h-screen md:w-2/5 overflow-hidden'>
					<m.div
						className='relative w-full h-full flex items-center justify-center bg-white'
						initial='hidden'
						animate='visible'
					>
						{/* Внешний круг */}
						<m.div
							className='w-[90vw] h-[90vw] max-w-[80vh] max-h-[80vh] bg-gray-950/20 rounded-full absolute border-2 border-indigo-400/30 scale-100 md:scale-125 lg:scale-150 transition-transform duration-300'
							variants={circleVariants}
						/>

						{/* Точки */}
						{points.map((point, i) => {
							const angleInRad = (point.angle * Math.PI) / 180;
							const radius = 180; // Относительно масштабируемого круга

							return (
								<m.div
									key={point.id}
									className='absolute w-2 h-2 bg-gray-400 rounded-full'
									style={{
										x: radius * Math.cos(angleInRad),
										y: radius * Math.sin(angleInRad),
									}}
									variants={dotVariants}
									custom={i}
								/>
							);
						})}

						{/* Центральный пульсирующий круг */}
						<m.div
							className='absolute w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 bg-gray-950 rounded-full shadow-lg shadow-gray-950/30'
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
					</m.div>
				</div>

				<m.div className='mt-4 flex-1 absolute left-8'>
					<m.main
						initial={{ y: -40, opacity: 0 }}
						whileInView={{ y: 0, opacity: 1 }}
						viewport={{ once: false }}
						transition={{ duration: 1 }}
						className='text-left md:text-left'
					>
						<m.h1
							className='text-3xl sm:text-4xl md:text-5xl text-gray-800 mb-4 font-[--font-montserrat] leading-tight'
							style={{ fontWeight: 700 }}
						>
							Генератор учебного расписания
						</m.h1>
						<m.p
							className='text-base sm:text-lg md:text-xl text-gray-600 mb-8 font-[--font-montserrat]'
							style={{ fontWeight: 500 }}
						>
							Генерируй своё учебное расписание за 5 минут — быстро и удобно.
						</m.p>
					</m.main>

					<nav className='flex flex-wrap gap-4 justify-start'>
						{navigationMainPage.map((link, index) => (
							<ButtonMotionLink
								key={index}
								icon={link.icon}
								href={link.href}
								title={link.title}
								indexButton={index}
							/>
						))}
					</nav>
				</m.div>
			</div>
		</>
	);
};
