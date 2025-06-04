import { Search } from "lucide-react";
import { SetStateAction } from "react";

type Props = {
	searchQuery: string;
	setSearchQuery: (value: SetStateAction<string>) => void;
};

export const FiledSearch = ({ searchQuery, setSearchQuery }: Props) => {
	return (
		<>
			{/* Поле поиска */}
			<div className='relative w-full md:w-auto'>
				<input
					type='text'
					placeholder='Поиск по названию, тексту или ответу...'
					value={searchQuery}
					onChange={e => setSearchQuery(e.target.value)}
					className='w-full px-4 py-2 pr-10 text-sm border border-gray-300 rounded-lg'
				/>
				<Search
					size={18}
					className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400'
				/>
			</div>
		</>
	);
};
