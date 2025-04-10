"use client";
import { useProfile } from "@/hook/useProfile";
import { feedbackService } from "@/services/feedback.service";
import { IAddFeedback } from "@/types/feedback.types";
import { useMutation } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import { m } from "motion/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { FeedbackList } from "./components/FeedbackList";

export const Feedback = () => {
	const { register, handleSubmit, reset } = useForm<IAddFeedback>();
	const { data: profile } = useProfile();

	const { mutate } = useMutation({
		mutationKey: ["feedback_add"],
		mutationFn: (data: IAddFeedback) =>
			feedbackService.addFeedback(data, profile!.id),
		onSuccess: () => {
			toast.success("Запись отправленна!");
			reset();
		},
		onError: error => {
			toast.error(error.message);
		},
	});

	const onSubmit: SubmitHandler<IAddFeedback> = data => {
		mutate(data);
	};

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
					<m.form
						variants={{
							hidden: { opacity: 0, y: 20 },
							visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
						}}
						className='lg:w-1/2 md:w-2/3 mx-auto bg-white p-8 rounded-lg shadow-md'
						onSubmit={handleSubmit(onSubmit)}
					>
						<div className='flex flex-wrap -m-2'>
							{/* Поле "Название" */}
							<div className='p-2 w-full'>
								<label
									htmlFor='title'
									className='leading-7 text-sm text-gray-600'
								>
									Название
								</label>
								<input
									{...register("title", { required: true })}
									id='title'
									type='text'
									className='w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out'
								/>
							</div>

							{/* Поле "Сообщение" */}
							<div className='p-2 w-full'>
								<label
									htmlFor='message'
									className='leading-7 text-sm text-gray-600'
								>
									Сообщение
								</label>
								<textarea
									{...register("text", { required: true })}
									id='message'
									className='w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out'
								></textarea>
							</div>

							{/* Кнопка отправки */}
							<div className='p-2 w-full'>
								<button
									type='submit'
									className='flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg transition-colors duration-200'
								>
									Отправить
								</button>
							</div>
						</div>
					</m.form>
				</div>

				<FeedbackList profile={profile} />
			</m.section>
		</>
	);
};
