"use client";

import { useProfile } from "@/hook/useProfile";
import { feedbackService } from "@/services/feedback.service";
import { IAdminFeedback } from "@/types/feedback.types";
import { useMutation, useQuery } from "@tanstack/react-query";
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

	const { mutate } = useMutation({
		mutationKey: ["feedback_admin"],
		mutationFn: (data: IAdminFeedback) =>
			feedbackService.adminFeedback(data, String(id)),
		onSuccess: () => {
			toast.success("Ответ отправлен");
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
				<div className='max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6'>
					{/* Feedback Display */}
					<div>
						<div className='flex justify-between items-start mb-4'>
							<h2 className='text-2xl font-bold text-gray-800'>
								{feedback.title}
							</h2>
							<span
								className={`px-3 py-1 rounded-full text-sm font-medium ${
									feedback.isCheck
										? "bg-green-100 text-green-800"
										: "bg-yellow-100 text-yellow-800"
								}`}
							>
								{feedback.isCheck ? "Reviewed" : "Pending"}
							</span>
						</div>

						<div className='mb-6'>
							<p className='text-gray-600 whitespace-pre-line'>
								{feedback.text}
							</p>
						</div>

						<div className='mt-6 pt-4 border-t border-gray-200 flex justify-between text-sm text-gray-500'>
							<span>
								Created: {new Date(feedback.CreatedAt).toLocaleString()}
							</span>
							{feedback.UpdatedAt !== feedback.CreatedAt && (
								<span>
									Updated: {new Date(feedback.UpdatedAt).toLocaleString()}
								</span>
							)}
						</div>
					</div>

					{/* Admin Feedback Form */}
					<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
						<div>
							<label
								htmlFor='feedback_admin'
								className='block text-sm font-medium text-gray-700 mb-1'
							>
								Ответ админа
							</label>
							<textarea
								id='feedback_admin'
								{...register("feedback_admin", {
									required: "Response is required",
								})}
								className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
								rows={4}
								placeholder='Enter your response here...'
								defaultValue={feedback.feedback_admin || ""}
							/>
						</div>

						<button
							type='submit'
							className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
						>
							Отправить
						</button>
					</form>

					{/* Existing Admin Response Display (will update after submission) */}
					{feedback.feedback_admin && (
						<div className='mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200'>
							<h3 className='text-lg font-semibold text-gray-700 mb-2'>
								Current Admin Response
							</h3>
							<p className='text-gray-600 whitespace-pre-line'>
								{feedback.feedback_admin}
							</p>
						</div>
					)}
				</div>
			)}
		</>
	);
};
