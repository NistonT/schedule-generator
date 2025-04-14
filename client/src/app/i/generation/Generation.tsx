"use client";

import { DASHBOARD_PAGES } from "@/config/pages-url.config";
import { useProfile } from "@/hook/useProfile";
import { cabinetsAtom } from "@/jotai/schedule";
import { scheduleService } from "@/services/schedule.service";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { CalendarDays, ExternalLink } from "lucide-react";
import { m } from "motion/react";
import Link from "next/link";

export const Generation = () => {
	const { data: profile } = useProfile();
	const [cabinets, setCabinets] = useAtom(cabinetsAtom);

	const { data: schedules } = useQuery({
		queryKey: ["schedules_query"],
		queryFn: () => scheduleService.getAllUsersSchedule(profile!.api_key),
		select: data => data.data,
	});

	return (
		<m.div
			variants={{
				hidden: { opacity: 0, y: 20 },
				visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
			}}
			initial='hidden'
			animate='visible'
			className='space-y-6'
		>
			{schedules &&
				schedules.map(schedule => (
					<m.div
						key={schedule.id}
						variants={{
							hidden: { opacity: 0, y: 20 },
							visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
						}}
						className='p-4 bg-white rounded-lg shadow-md border border-gray-100'
					>
						{/* Заголовок расписания */}
						<div className='flex items-center gap-2 mb-3'>
							<CalendarDays size={20} className='text-indigo-600' />
							<h2 className='text-lg font-semibold text-gray-800'>
								{schedule.title}
							</h2>
						</div>

						{/* Ссылка "Перейти" */}
						<div className='flex justify-end'>
							<Link
								href={`${DASHBOARD_PAGES.GENERATION}/${schedule.id}`}
								className='flex items-center gap-1 text-indigo-600 hover:text-indigo-700 transition-colors font-medium'
							>
								<span>Перейти</span>
								<ExternalLink size={16} />
							</Link>
						</div>

						{/* Разделитель */}
						<hr className='mt-4 border-gray-200' />
					</m.div>
				))}
		</m.div>
	);
};
