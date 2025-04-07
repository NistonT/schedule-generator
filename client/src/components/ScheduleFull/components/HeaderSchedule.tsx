import { DASHBOARD_PAGES } from "@/config/pages-url.config";
import Link from "next/link";

type Props = {
	id: string;
	title: string | undefined;
};

export const HeaderSchedule = ({ id, title }: Props) => {
	return (
		<>
			<div className='flex justify-between'>
				<h1>{title}</h1>
				<h2 className='text-xl font-bold text-gray-800'>ID: {id}</h2>
				<Link href={`${DASHBOARD_PAGES.SCHEDULE_ID}${id}`}>
					Перейти в расписание
				</Link>
			</div>
		</>
	);
};
