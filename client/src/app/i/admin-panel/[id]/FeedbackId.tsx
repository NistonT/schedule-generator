"use client";

import { useProfile } from "@/hook/useProfile";
import { feedbackService } from "@/services/feedback.service";
import { IAdminFeedback } from "@/types/feedback.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
	CheckCircle,
	Clock,
	Edit,
	Lock,
	MessageSquare,
	User,
} from "lucide-react";
import { m } from "motion/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
	id: number;
};

export const FeedbackId = ({ id }: Props) => {
	const { data: profile } = useProfile();
	const { register, handleSubmit, reset } = useForm<IAdminFeedback>();

	const { data: feedback } = useQuery({
		queryKey: ["feedback_id"],
		queryFn: () => feedbackService.getIdFeedback(String(id)),
		select: data => data.data,
	});

	const isFormDisabled = !!feedback?.feedback_admin;

	const { mutate } = useMutation({
		mutationKey: ["feedback_admin"],
		mutationFn: (data: IAdminFeedback) =>
			feedbackService.adminFeedback(data, String(id)),
		onSuccess: response => {
			toast.success("Ответ отправлен");
			reset();
			location.reload();
		},
	});

	const onSubmit: SubmitHandler<IAdminFeedback> = data => {
		const { isCheck, admin, feedback_admin } = data;

		const result = {
			isCheck: true,
			admin: profile!.username,
			feedback_admin: feedback_admin,
		};

		mutate(result);
	};

	return (
		<>
			{feedback && (
				<m.div
					variants={{
						hidden: { opacity: 0, y: 20 },
						visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
					}}
					initial='hidden'
					animate='visible'
					className='max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6'
				>
					{/* Отображение отзыва */}
					<m.div
						variants={{
							hidden: { opacity: 0, y: 20 },
							visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
						}}
					>
						<div>
							<div className='flex justify-between items-start mb-4'>
								<h2 className='text-2xl font-bold text-gray-800 flex items-center gap-2'>
									{feedback?.isCheck ? (
										<CheckCircle size={20} className='text-green-600' />
									) : (
										<Clock size={20} className='text-yellow-600' />
									)}
									{feedback?.title}
								</h2>
								<span
									className={`px-3 py-1 rounded-full text-sm font-medium select-none flex items-center gap-1 ${
										feedback?.isCheck
											? "bg-green-100 text-green-800"
											: "bg-yellow-100 text-yellow-800"
									}`}
								>
									{feedback?.isCheck ? (
										<>
											<CheckCircle size={16} /> Отвечено
										</>
									) : (
										<>
											<Clock size={16} /> В ожидании
										</>
									)}
								</span>
							</div>

							<div className='mb-6'>
								<p className='text-gray-600 whitespace-pre-line'>
									{feedback?.text}
								</p>
							</div>

							<div className='mt-6 pt-4 border-t border-gray-200 flex justify-between text-sm text-gray-500'>
								<div className='flex items-center gap-2'>
									<User size={16} />
									<span>
										Отправлено: {new Date(feedback?.CreatedAt).toLocaleString()}
									</span>
								</div>
								{feedback.UpdatedAt !== feedback.CreatedAt && (
									<div className='flex items-center gap-2'>
										<Edit size={16} />
										<span>
											Изменено: {new Date(feedback.UpdatedAt).toLocaleString()}
										</span>
									</div>
								)}
							</div>
						</div>
					</m.div>

					{/* Форма ответа администратора */}
					{!isFormDisabled && (
						<m.form
							variants={{
								hidden: { opacity: 0, y: 20 },
								visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
							}}
							onSubmit={handleSubmit(onSubmit)}
							className='space-y-4'
						>
							<div>
								<label
									htmlFor='feedback_admin'
									className='block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2'
								>
									<MessageSquare size={16} /> Ответ админа
								</label>
								<textarea
									id='feedback_admin'
									{...register("feedback_admin", {
										required: "Response is required",
									})}
									className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
									rows={4}
									placeholder='Введите ответ'
									defaultValue={feedback.feedback_admin || ""}
								/>
							</div>

							<button
								type='submit'
								className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
							>
								Отправить
							</button>
						</m.form>
					)}

					{/* Отображение существующего ответа администратора */}
					{isFormDisabled && (
						<m.div
							variants={{
								hidden: { opacity: 0, y: 20 },
								visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
							}}
							className='mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200'
						>
							<h3 className='text-lg font-semibold text-gray-700 flex items-center gap-2 mb-2'>
								<Lock size={16} /> Ответ администратора (заблокировано)
							</h3>
							<p className='text-gray-600 whitespace-pre-line'>
								{feedback.feedback_admin}
							</p>
						</m.div>
					)}
				</m.div>
			)}
		</>
	);
};
