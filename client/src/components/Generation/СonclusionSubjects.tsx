import { CombinedRecord } from "@/types/schedule.type";

type Props = {
	combinedRecords: CombinedRecord[];
	handleRemoveAmountLimit: (index: number) => void;
};

export const ConclusionSubjects = ({
	combinedRecords,
	handleRemoveAmountLimit,
}: Props) => {
	return (
		<div className='mb-4 p-4 border rounded-lg flex flex-wrap gap-2'>
			{combinedRecords.map((record, index) => (
				<div
					key={index}
					className='px-3 py-1 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300 transition-colors'
					onClick={() => handleRemoveAmountLimit(index)}
				>
					{`Группа: ${record.group}, Предмет: ${record.subject}, Преподаватель: ${record.teacherName}, Количество: ${record.amount}, Тип: ${record.lessonType}`}
				</div>
			))}
		</div>
	);
};
