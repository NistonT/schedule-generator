"use client";

import { DASHBOARD_PAGES } from "@/config/pages-url.config";
import { feedbackService } from "@/services/feedback.service";
import { IFeedback } from "@/types/feedback.types";
import { useQuery } from "@tanstack/react-query";
import {
	CheckCircle,
	Clock,
	Edit,
	ExternalLink,
	MessageSquare,
	User,
} from "lucide-react";
import { m } from "motion/react";
import Link from "next/link";

export const FeedbackList = () => {
	const { data: feedback_list } = useQuery({
		queryKey: ["feedback_list"],
		queryFn: () => feedbackService.getAllUserFeedback(),
		select: data => {
			// Сначала сортируем отзывы: сначала ожидающие, затем проверенные
			return [...data.data].sort((a, b) => {
				if (a.isCheck === b.isCheck) return 0;
				return a.isCheck ? 1 : -1;
			});
		},
	});

	return (
		<m.div
			variants={{
				hidden: { opacity: 0, y: 20 },
				visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
			}}
			initial='hidden'
			animate='visible'
			className='space-y-6'
		>
			{/* Секция ожидающих отзывов */}
			<div className='space-y-4'>
				<h3 className='text-lg font-semibold text-blue-600 flex items-center gap-2'>
					<Clock size={18} />
					Ожидающие ответа
				</h3>
				{feedback_list
					?.filter(feedback => !feedback.isCheck)
					.map(feedback => (
						<FeedbackItem key={feedback.id} feedback={feedback} />
					))}
			</div>

			{/* Секция проверенных отзывов */}
			<div className='space-y-4'>
				<h3 className='text-lg font-semibold text-green-600 flex items-center gap-2'>
					<CheckCircle size={18} />
					Отвеченные
				</h3>
				{feedback_list
					?.filter(feedback => feedback.isCheck)
					.map(feedback => (
						<FeedbackItem key={feedback.id} feedback={feedback} />
					))}
			</div>
		</m.div>
	);
};

type PropsFeedback = {
	feedback: IFeedback;
};

const FeedbackItem = ({ feedback }: PropsFeedback) => {
	return (
		<m.div
			variants={{
				hidden: { opacity: 0, y: 20 },
				visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
			}}
			className={`p-4 rounded-lg shadow-md ${
				feedback.isCheck
					? "bg-green-50 border-l-4 border-green-500"
					: "bg-white border-l-4 border-blue-500"
			}`}
		>
			{/* Заголовок и статус */}
			<div className='flex justify-between items-start'>
				<h3 className='text-lg font-semibold text-gray-800'>
					{feedback.title}
				</h3>
				<span
					className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${
						feedback.isCheck
							? "bg-green-100 text-green-800"
							: "bg-blue-100 text-blue-800"
					}`}
				>
					{feedback.isCheck ? (
						<>
							<CheckCircle size={14} /> Отвечено
						</>
					) : (
						<>
							<Clock size={14} /> В ожидании
						</>
					)}
				</span>
			</div>

			{/* Текст отзыва */}
			<p className='mt-2 text-gray-600'>{feedback.text}</p>

			{/* Ответ администратора */}
			{feedback.feedback_admin && (
				<div className='mt-3 p-3 bg-gray-50 rounded'>
					<p className='text-sm font-medium text-gray-700 flex items-center gap-2'>
						<MessageSquare size={16} /> Ответ админа:
					</p>
					<p className='text-sm text-gray-600'>{feedback.feedback_admin}</p>
				</div>
			)}

			{/* Дата и информация об изменении */}
			<div className='mt-3 flex justify-between items-center text-xs text-gray-500'>
				<div className='flex items-center gap-2'>
					<User size={14} />
					<span>
						Отправлено: {new Date(feedback.CreatedAt).toLocaleDateString()}
					</span>
				</div>
				{feedback.UpdatedAt !== feedback.CreatedAt && (
					<div className='flex items-center gap-2'>
						<Edit size={14} />
						<span>
							Изменено: {new Date(feedback.UpdatedAt).toLocaleDateString()}
						</span>
					</div>
				)}
			</div>

			{/* Ссылка на детали отзыва */}
			<div className='mt-4 flex justify-end'>
				<Link
					href={`${DASHBOARD_PAGES.ADMIN_PANEL}/${feedback.id}`}
					className='flex items-center gap-1 text-indigo-600 hover:text-indigo-700 transition-colors'
				>
					<span>Перейти</span>
					<ExternalLink size={16} />
				</Link>
			</div>
		</m.div>
	);
};
