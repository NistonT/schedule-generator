import { feedbackService } from "@/services/feedback.service";
import { IUser } from "@/types/user.type";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useFeedbackList = (profile: IUser | undefined) => {
	const [expandedFeedback, setExpandedFeedback] = useState<
		Record<string, boolean>
	>({});
	const [showChecked, setShowChecked] = useState(true); // Фильтр для проверенных записей
	const [showUnchecked, setShowUnchecked] = useState(true); // Фильтр для непроверенных записей
	const [searchQuery, setSearchQuery] = useState(""); // Поисковый запрос

	const { data: feedback_list } = useQuery({
		queryKey: ["feedback_list"],
		queryFn: () => feedbackService.getUserFeedback(profile!.id),
		select: data => {
			// Сначала сортируем отзывы: сначала ожидающие, затем проверенные
			return [...data.data].sort((a, b) => {
				if (a.isCheck === b.isCheck) return 0;
				return a.isCheck ? -1 : 1;
			});
		},
	});

	// Initialize expanded state when data loads
	useEffect(() => {
		if (feedback_list) {
			const initialExpandedState: Record<string, boolean> = {};
			feedback_list.forEach(feedback => {
				initialExpandedState[feedback.id] = true;
			});
			setExpandedFeedback(initialExpandedState);
		}
	}, [feedback_list]);

	const toggleFeedback = (feedbackId: string) => {
		setExpandedFeedback(prev => ({
			...prev,
			[feedbackId]: !prev[feedbackId],
		}));
	};

	// Функция для фильтрации отзывов
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

	return {
		expandedFeedback,
		filteredFeedbacks,
		toggleFeedback,
		showChecked,
		setShowChecked,
		showUnchecked,
		setShowUnchecked,
		searchQuery,
		setSearchQuery,
	};
};
