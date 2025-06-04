"use client";
import { usePostFeedback } from "@/hook/usePostFeedback";
import { useProfile } from "@/hook/useProfile";
import { m } from "motion/react";
import { FeedbackList } from "./components/FeedbackList";
import { Form } from "./components/Form";
import { Title } from "./components/Title";

export const Feedback = () => {
	const { data: profile } = useProfile();

	const { register, handleSubmit, onSubmit } = usePostFeedback(profile);

	return (
		<>
			<m.section
				variants={{
					hidden: { opacity: 0, y: 20 },
					visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
				}}
				initial='hidden'
				animate='visible'
				className='text-gray-600 body-font relative min-h-screen'
			>
				{/* Заголовок */}
				<div className='container px-5 py-24 mx-auto'>
					<Title />

					{/* Форма */}
					<Form
						handleSubmit={handleSubmit}
						onSubmit={onSubmit}
						register={register}
					/>
				</div>

				<FeedbackList profile={profile} />
			</m.section>
		</>
	);
};
