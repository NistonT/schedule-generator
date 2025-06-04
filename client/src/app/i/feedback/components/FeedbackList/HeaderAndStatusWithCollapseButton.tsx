import { CheckCircle, ChevronDown, ChevronUp, Clock } from "lucide-react";

type Props = {
	id: string;
	isCheck: boolean;
	title: string;
	CreatedAt: string;
	expandedFeedback: Record<string, boolean>;
	toggleFeedback: (feedbackId: string) => void;
};

export const HeaderAndStatusWithCollapseButton = ({
	id,
	isCheck,
	title,
	CreatedAt,
	expandedFeedback,
	toggleFeedback,
}: Props) => {
	return (
		<div
			className='flex justify-between items-start cursor-pointer'
			onClick={() => toggleFeedback(id)}
		>
			<div className='flex items-start gap-2'>
				{isCheck ? (
					<CheckCircle size={18} className='text-green-600 mt-0.5' />
				) : (
					<Clock size={18} className='text-blue-600 mt-0.5' />
				)}
				<div>
					<h3 className='text-lg font-semibold text-gray-800'>{title}</h3>
					<span className='text-xs text-gray-500'>
						{new Date(CreatedAt).toLocaleDateString()}
					</span>
				</div>
			</div>
			<div className='flex items-center gap-2'>
				<span
					className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${
						isCheck
							? "bg-green-100 text-green-800"
							: "bg-blue-100 text-blue-800"
					}`}
				>
					{isCheck ? (
						<>
							<CheckCircle size={14} /> Отвечено
						</>
					) : (
						<>
							<Clock size={14} /> В ожидании
						</>
					)}
				</span>
				{expandedFeedback[id] ? (
					<ChevronUp size={18} className='text-gray-500' />
				) : (
					<ChevronDown size={18} className='text-gray-500' />
				)}
			</div>
		</div>
	);
};
