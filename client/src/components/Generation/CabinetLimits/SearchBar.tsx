import { Search } from "lucide-react";
import { SetStateAction } from "react";

type Props = {
	searchTerm: string;
	setSearchTerm: (value: SetStateAction<string>) => void;
};

export const SearchBar = ({ searchTerm, setSearchTerm }: Props) => {
	return (
		<>
			{/* Панель поиска */}
			<div className='mb-6'>
				<div className='flex items-center gap-2 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg shadow-sm'>
					<Search className='w-5 h-5 text-gray-500 dark:text-gray-400' />
					<input
						type='text'
						placeholder='Поиск по преподавателю или кабинету'
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
						className='w-full bg-transparent outline-none text-gray-800 dark:text-white placeholder:text-gray-400'
					/>
				</div>
			</div>
		</>
	);
};
