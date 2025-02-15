import { words } from "@/constants/words.constants";
import { useWordsHeader } from "@/hook/useWordsHeader";
import { Bot } from "lucide-react";
import Link from "next/link";

export const Header = () => {
	const word = useWordsHeader(words);

	return (
		<header>
			<div className='container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center mt-5 relative z-50'>
				<div className='flex items-center fixed top-5'>
					<Link
						className='text-3xl px-6 py-4 text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-md transition-all cursor-default flex items-center gap-3'
						href={"/"}
					>
						<Bot className='w-10 h-10' />
						ГЕНЕРАТОР API
					</Link>
					<span className='text-gray-600 text-xl bg-white py-4 px-8	'>
						| {word}
					</span>
				</div>
			</div>
		</header>
	);
};
