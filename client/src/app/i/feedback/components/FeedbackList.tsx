"use client";

import { feedbackService } from "@/services/feedback.service";
import { useQuery } from "@tanstack/react-query";

export const Feedback_list = () => {
	const { data: feedback_list } = useQuery({
		queryKey: ["feedback_list"],
		queryFn: () => feedbackService.getAllUserFeedback(),
		select: data => data.data,
	});

	return (
		<>
			{feedback_list && (
				<div className='space-y-4'>
					{feedback_list.map(feedback => (
						<div
							key={feedback.id}
							className={`p-4 rounded-lg shadow-md ${
								feedback.isCheck
									? "bg-green-50 border-l-4 border-green-500"
									: "bg-white border-l-4 border-blue-500"
							}`}
						>
							<div className='flex justify-between items-start'>
								<h3 className='text-lg font-semibold text-gray-800'>
									{feedback.title}
								</h3>
								<span
									className={`px-2 py-1 text-xs rounded-full ${
										feedback.isCheck
											? "bg-green-100 text-green-800"
											: "bg-blue-100 text-blue-800"
									}`}
								>
									{feedback.isCheck ? "Отвечено" : "В ожидание"}
								</span>
							</div>
							<p className='mt-2 text-gray-600'>{feedback.text}</p>

							{feedback.feedback_admin && (
								<div className='mt-3 p-3 bg-gray-50 rounded'>
									<p className='text-sm font-medium text-gray-700'>
										Ответ админа:
									</p>
									<p className='text-sm text-gray-600'>
										{feedback.feedback_admin}
									</p>
								</div>
							)}

							<div className='mt-3 flex justify-between items-center text-xs text-gray-500'>
								<span>
									Отправленна:{" "}
									{new Date(feedback.CreatedAt).toLocaleDateString()}
								</span>
								{feedback.UpdatedAt !== feedback.CreatedAt && (
									<span>
										Изменена:{" "}
										{new Date(feedback.UpdatedAt).toLocaleDateString()}
									</span>
								)}
							</div>
						</div>
					))}
				</div>
			)}
		</>
	);
};
