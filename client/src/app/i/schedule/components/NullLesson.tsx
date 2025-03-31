import { BookOpen } from "lucide-react";

export const NullLesson = () => {
	return (
		<p className='text-gray-500 flex items-center gap-2'>
			<BookOpen size={16} /> Нет занятий
		</p>
	);
};
