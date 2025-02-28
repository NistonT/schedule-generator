import { m } from "motion/react";

export const Title = () => {
	return (
		<>
			<m.main
				initial={{
					y: -40,
					opacity: 0,
				}}
				whileInView={{
					y: 0,
					opacity: 1,
				}}
				viewport={{ once: false }}
				transition={{
					duration: 1,
				}}
				className='text-center select-none'
			>
				<m.h1
					className='text-4xl text-gray-800 mb-4 font-[--font-montserrat]'
					style={{ fontWeight: 700 }}
				>
					Генератор учебного расписания
				</m.h1>
				<m.p
					className='text-lg text-gray-600 mb-8 font-[--font-montserrat]'
					style={{ fontWeight: 500 }}
				>
					Генерируй свое учебное расписание за 5 минут
				</m.p>
			</m.main>
		</>
	);
};
