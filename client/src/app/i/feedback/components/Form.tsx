import { ButtonSubmit } from "@/components/ui/buttons/ButtonSubmit";
import { IAddFeedback } from "@/types/feedback.type";
import { m } from "motion/react";
import {
	SubmitErrorHandler,
	SubmitHandler,
	UseFormRegister,
} from "react-hook-form";

type Props = {
	handleSubmit: (
		onValid: SubmitHandler<IAddFeedback>,
		onInvalid?: SubmitErrorHandler<IAddFeedback> | undefined
	) => (e?: React.BaseSyntheticEvent) => Promise<void>;
	onSubmit: SubmitHandler<IAddFeedback>;
	register: UseFormRegister<IAddFeedback>;
};

export const Form = ({ handleSubmit, onSubmit, register }: Props) => {
	return (
		<>
			{/* Форма */}
			<m.form
				variants={{
					hidden: { opacity: 0, y: 20 },
					visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
				}}
				className='lg:w-1/2 md:w-2/3 mx-auto p-8 rounded-lg'
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className='flex flex-wrap -m-2'>
					{/* Поле "Название" */}
					<div className='p-2 w-full'>
						<label htmlFor='title' className='leading-7 text-sm text-gray-600'>
							Название
						</label>
						<input
							{...register("title", { required: true })}
							id='title'
							type='text'
							className='w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out'
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
							className='w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out'
						></textarea>
					</div>

					{/* Кнопка отправки */}
					<div className='p-2 w-full'>
						<ButtonSubmit title={"Отправить"} />
					</div>
				</div>
			</m.form>
		</>
	);
};
