"use client";

import { useFeedbackList } from "@/hook/useFeedbackList";
import { IUser } from "@/types/user.type";
import { m } from "motion/react";
import { ContentsOfTheReview } from "./FeedbackList/ContentsOfTheReview";
import { FiledSearch } from "./FeedbackList/FieldSearch";
import { FilterControlButtons } from "./FeedbackList/FilterControlButtons";
import { HeaderAndStatusWithCollapseButton } from "./FeedbackList/HeaderAndStatusWithCollapseButton";

type Props = {
	profile: IUser | undefined;
};

export const FeedbackList = ({ profile }: Props) => {
	const {
		expandedFeedback,
		filteredFeedbacks,
		toggleFeedback,
		showChecked,
		setShowChecked,
		showUnchecked,
		setShowUnchecked,
		searchQuery,
		setSearchQuery,
	} = useFeedbackList(profile);

	return (
		<m.div
			variants={{
				hidden: { opacity: 0, y: 20 },
				visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
			}}
			initial='hidden'
			animate='visible'
			className='space-y-4'
		>
			{/* Панель управления: фильтры и поиск */}
			<div className='flex flex-col md:flex-row items-center gap-4 mb-4'>
				{/* Кнопки управления фильтрами */}
				<FilterControlButtons
					setShowChecked={setShowChecked}
					showChecked={showChecked}
					showUnchecked={showUnchecked}
					setShowUnchecked={setShowUnchecked}
				/>

				{/* Поле поиска */}
				<FiledSearch
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
				/>
			</div>

			{/* Отфильтрованный список отзывов */}
			{filteredFeedbacks && filteredFeedbacks.length > 0 ? (
				filteredFeedbacks.map(feedback => (
					<m.div
						key={feedback.id}
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
						{/* Заголовок и статус с кнопкой сворачивания */}
						<HeaderAndStatusWithCollapseButton
							id={feedback.id}
							isCheck={feedback.isCheck}
							title={feedback.title}
							CreatedAt={feedback.CreatedAt}
							expandedFeedback={expandedFeedback}
							toggleFeedback={toggleFeedback}
						/>

						{/* Содержимое отзыва (условный рендеринг) */}
						<ContentsOfTheReview
							id={feedback.id}
							text={feedback.text}
							feedback_admin={feedback.feedback_admin}
							admin={feedback.admin}
							expandedFeedback={expandedFeedback}
							UpdatedAt={""}
							CreatedAt={feedback.CreatedAt}
						/>
					</m.div>
				))
			) : (
				<p className='text-center text-gray-500'>
					Нет отзывов, соответствующих фильтрам.
				</p>
			)}
		</m.div>
	);
};
