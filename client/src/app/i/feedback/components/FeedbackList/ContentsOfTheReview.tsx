import { Edit, MessageSquare, User } from "lucide-react";

type Props = {
	id: string;
	text: string;
	feedback_admin: string | undefined;
	admin: string | undefined;
	expandedFeedback: Record<string, boolean>;
	UpdatedAt: string;
	CreatedAt: string;
};

export const ContentsOfTheReview = ({
	id,
	text,
	feedback_admin,
	admin,
	expandedFeedback,
	UpdatedAt,
	CreatedAt,
}: Props) => {
	return (
		<>
			{/* Содержимое отзыва (условный рендеринг) */}
			{expandedFeedback[id] && (
				<div className='mt-3 space-y-3'>
					{/* Текст отзыва */}
					<p className='text-gray-600'>{text}</p>

					{/* Ответ администратора */}
					{feedback_admin && (
						<div className='p-3 bg-gray-50 rounded'>
							<p className='text-sm font-medium text-gray-700 flex items-center gap-2'>
								<MessageSquare size={16} /> Ответ админа:
							</p>
							<p className='text-sm text-gray-600 mt-1'>{feedback_admin}</p>
						</div>
					)}

					{/* Дополнительная информация */}
					<div className='flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-100'>
						{admin && (
							<p className='flex items-center gap-2'>
								<User size={14} />
								<span>Ответил: {admin}</span>
							</p>
						)}
						{UpdatedAt !== CreatedAt && (
							<div className='flex items-center gap-2'>
								<Edit size={14} />
								<span>
									Изменено: {new Date(UpdatedAt).toLocaleDateString()}
								</span>
							</div>
						)}
					</div>
				</div>
			)}
		</>
	);
};
