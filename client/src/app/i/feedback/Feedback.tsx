"use client";
import { Mail } from "lucide-react";
import { m } from "motion/react";

export const Feedback = () => {
	return (
		<>
			<m.section
				variants={{
					hidden: { opacity: 0, y: 20 },
					visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
				}}
				initial='hidden'
				animate='visible'
				className='text-gray-600 body-font relative bg-gray-50 min-h-screen'
			>
				{/* Заголовок */}
				<div className='container px-5 py-24 mx-auto'>
					<m.div
						variants={{
							hidden: { opacity: 0, y: 20 },
							visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
						}}
						className='flex flex-col text-center w-full mb-12'
					>
						<h1 className='sm:text-3xl text-2xl font-medium title-font mb-4 text-indigo-600 flex items-center justify-center gap-2'>
							<Mail size={24} /> <span>Обратная связь</span>
						</h1>
						<p className='lg:w-2/3 mx-auto leading-relaxed text-base text-gray-700'>
							Если у вас есть вопросы или предложения, свяжитесь с нами. Мы
							всегда готовы помочь!
						</p>
					</m.div>

					{/* Форма */}
					<m.div
						variants={{
							hidden: { opacity: 0, y: 20 },
							visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
						}}
						className='lg:w-1/2 md:w-2/3 mx-auto bg-white p-8 rounded-lg shadow-md'
					>
						<div className='flex flex-wrap -m-2'>
							{/* Поле "Сообщение" */}
							<div className='p-2 w-full'>
								<label
									htmlFor='message'
									className='leading-7 text-sm text-gray-600'
								>
									Сообщение
								</label>
								<textarea
									id='message'
									name='message'
									className='w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out'
								></textarea>
							</div>

							{/* Кнопка отправки */}
							<div className='p-2 w-full'>
								<button className='flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg transition-colors duration-200'>
									Отправить
								</button>
							</div>
						</div>
					</m.div>
				</div>
			</m.section>
		</>
	);
};
