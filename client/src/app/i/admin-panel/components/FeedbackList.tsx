"use client";

import { DASHBOARD_PAGES } from "@/config/pages-url.config";
import { feedbackService } from "@/services/feedback.service";
import { IFeedback } from "@/types/feedback.type";
import { useQuery } from "@tanstack/react-query";
import {
	CheckCircle,
	Clock,
	Edit,
	ExternalLink,
	MessageSquare,
	Search,
	User,
} from "lucide-react";
import { m } from "motion/react";
import Link from "next/link";
import { useState } from "react";

export const FeedbackList = () => {
	const [showChecked, setShowChecked] = useState(true); // Фильтр для проверенных записей
	const [showUnchecked, setShowUnchecked] = useState(true); // Фильтр для непроверенных записей
	const [searchQuery, setSearchQuery] = useState(""); // Поисковый запрос

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

	// Фильтрация отзывов
	const filteredFeedbacks = feedback_list?.filter(feedback => {
		// Проверяем соответствие фильтрам (проверенные/непроверенные)
		if (feedback.isCheck && !showChecked) return false;
		if (!feedback.isCheck && !showUnchecked) return false;

		// Приводим поисковый запрос и поля к нижнему регистру для удобства сравнения
		const query = searchQuery.trim().toLowerCase();
		if (query) {
			// Проверяем вхождение запроса в название, текст отзыва или ответ администратора
			const matchesTitle = feedback.title.toLowerCase().includes(query);
			const matchesText = feedback.text.toLowerCase().includes(query);
			const matchesAdminResponse = feedback.feedback_admin
				? feedback.feedback_admin.toLowerCase().includes(query)
				: false;

			// Если запрос не найден ни в одном из полей, исключаем отзыв
			if (!matchesTitle && !matchesText && !matchesAdminResponse) {
				return false;
			}
		}

		return true;
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
			{/* Панель управления: фильтры и поиск */}
			<div className='flex flex-col md:flex-row items-center gap-4 mb-4'>
				{/* Кнопки управления фильтрами */}
				<div className='flex items-center gap-4'>
					<button
						onClick={() => setShowChecked(prev => !prev)}
						className={`px-3 py-2 text-sm rounded ${
							showChecked
								? "bg-green-500 text-white"
								: "bg-gray-200 text-gray-700"
						}`}
					>
						{showChecked ? "Скрыть проверенные" : "Показать проверенные"}
					</button>
					<button
						onClick={() => setShowUnchecked(prev => !prev)}
						className={`px-3 py-2 text-sm rounded ${
							showUnchecked
								? "bg-blue-500 text-white"
								: "bg-gray-200 text-gray-700"
						}`}
					>
						{showUnchecked ? "Скрыть непроверенные" : "Показать непроверенные"}
					</button>
				</div>

				{/* Поле поиска */}
				<div className='relative w-full md:w-auto'>
					<input
						type='text'
						placeholder='Поиск по названию, тексту или ответу...'
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
						className='w-full px-4 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500'
					/>
					<Search
						size={18}
						className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400'
					/>
				</div>
			</div>

			{/* Отфильтрованный список отзывов */}
			{filteredFeedbacks && filteredFeedbacks.length > 0 ? (
				filteredFeedbacks.map(feedback => (
					<FeedbackItem key={feedback.id} feedback={feedback} />
				))
			) : (
				<p className='text-center text-gray-500'>
					Нет отзывов, соответствующих фильтрам.
				</p>
			)}
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
					className='flex items-center gap-1 text-gray-950 transition-colors'
				>
					<span>Перейти</span>
					<ExternalLink size={16} />
				</Link>
			</div>
		</m.div>
	);
};
