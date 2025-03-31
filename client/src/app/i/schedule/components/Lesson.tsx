import { BookOpen, Clock, MapPin, User } from "lucide-react";

type Props = {
	index: number;
	subject: string;
	cabinet: string;
	teacher: string;
	lessonType: string;
};

export const Lesson = ({
	index,
	subject,
	cabinet,
	teacher,
	lessonType,
}: Props) => {
	return (
		<div key={index} className='bg-white shadow-sm rounded-lg p-4 space-y-2'>
			<div className='flex items-center gap-2'>
				<BookOpen size={18} className='text-blue-500' />
				<span className='text-gray-700 font-medium'>{subject}</span>
			</div>
			<div className='flex items-center gap-2 text-sm text-gray-600'>
				<MapPin size={16} className='text-green-500' />
				<span>Кабинет: {cabinet}</span>
			</div>
			<div className='flex items-center gap-2 text-sm text-gray-600'>
				<User size={16} className='text-purple-500' />
				<span>Преподаватель: {teacher}</span>
			</div>
			<div className='flex items-center gap-2 text-sm text-gray-600'>
				<Clock size={16} className='text-yellow-500' />
				<span>Тип занятия: {lessonType}</span>
			</div>
		</div>
	);
};
