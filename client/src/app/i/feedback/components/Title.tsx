import { Mail } from "lucide-react";
import { m } from "motion/react";

export const Title = () => {
	return (
		<m.div
			variants={{
				hidden: { opacity: 0, y: 20 },
				visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
			}}
			className='flex flex-col text-center w-full mb-12'
		>
			<h1 className='sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-950 flex items-center justify-center gap-2'>
				<Mail size={24} /> <span>Обратная связь</span>
			</h1>
			<p className='lg:w-2/3 mx-auto leading-relaxed text-base text-gray-700'>
				Если у вас есть вопросы или предложения, свяжитесь с нами. Мы всегда
				готовы помочь!
			</p>
		</m.div>
	);
};
