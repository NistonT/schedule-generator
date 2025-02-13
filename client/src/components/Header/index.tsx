import Link from "next/link";

export const Header = () => {
	return (
		<header className='text-gray-600 body-font'>
			<div className='container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center'>
				<Link
					className='text-3xl px-6 py-4 text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-md shadow-md transition-all cursor-default fixed top-5'
					href={"/"}
				>
					ГЕНЕРАТОР API
				</Link>
			</div>
		</header>
	);
};
