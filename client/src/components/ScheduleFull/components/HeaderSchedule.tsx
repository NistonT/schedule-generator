import { DASHBOARD_PAGES } from "@/config/pages-url.config";
import { ArrowRight } from "lucide-react";
import { m } from "motion/react";
import Link from "next/link";

type Props = {
	id: string;
	index: number;
	title: string | undefined;
};

export const HeaderSchedule = ({ id, title, index }: Props) => {
	return (
		<>
			<m.div
				variants={{
					hidden: { opacity: 0, x: -20 },
					visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
				}}
				initial='hidden'
				animate='visible'
				className='flex justify-between items-center p-4 bg-white rounded-lg'
			>
				{/* Заголовок */}
				<div className='flex flex-col space-y-1'>
					<h1 className='text-2xl font-bold text-gray-900'>
						{title === "Расписание" ? (
							<>
								{title} - {index + 1}
							</>
						) : (
							title
						)}
					</h1>
					<h2 className='text-base text-gray-600'>ID: {id}</h2>
				</div>

				{/* Ссылка "Перейти в расписание" */}
				<Link
					href={`${DASHBOARD_PAGES.SCHEDULE_ID}${id}`}
					className='flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors'
				>
					Перейти в расписание
					<ArrowRight size={18} className='text-indigo-600' />
				</Link>
			</m.div>
		</>
	);
};
