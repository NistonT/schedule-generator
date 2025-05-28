import { BookOpenIcon, HashIcon, User, Users } from "lucide-react";
// Иконки для улучшения восприятия данных
export const GroupIcon = () => (
	<span className='text-gray-400'>
		{/* Можно использовать любую подходящую иконку */}
		<Users size={14} />
	</span>
);

export const TeacherIcon = () => (
	<span className='text-gray-400'>
		{/* Например, User или BookOpen */}
		<User size={14} />
	</span>
);

export const BookOpen = () => (
	<span className='text-gray-400'>
		<BookOpenIcon size={14} />
	</span>
);

export const Hash = () => (
	<span className='text-gray-400'>
		<HashIcon size={14} />
	</span>
);
