"use client";

import { ScheduleLesson } from "@/components/ScheduleFull/ScheduleLesson";
import { DASHBOARD_PAGES } from "@/config/pages-url.config";
import { useProfile } from "@/hook/useProfile";
import { scheduleAtom } from "@/jotai/schedule";
import { scheduleService } from "@/services/schedule.service";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { ArrowLeft, CalendarCheck, Users } from "lucide-react";
import { m } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Description } from "./components/Description";
import { Title } from "./components/Title";

type Props = {
	id: number;
};

export const ScheduleId = ({ id }: Props) => {
	const [scheduleId, setScheduleId] = useAtom(scheduleAtom);

	const { data: profile } = useProfile();
	const { push } = useRouter();

	const { data: schedule_id } = useQuery({
		queryKey: ["schedule_get"],
		queryFn: () => scheduleService.getSchedule(profile!.api_key, String(id)),
		select: data => data.data,
	});

	useEffect(() => {
		if (!schedule_id) {
			push(DASHBOARD_PAGES.SCHEDULE);
		}
		if (schedule_id) {
			setScheduleId(schedule_id);
		}
	}, [schedule_id]);

	return (
		<div className='space-y-8'>
			{/* Заголовок и описание расписания */}
			<div className='bg-white p-6 rounded-lg shadow-md border border-gray-100 space-y-4'>
				{/* Анимированный контейнер */}
				<m.div
					variants={{
						hidden: { opacity: 0, y: 20 },
						visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
					}}
					initial='hidden'
					animate='visible'
					className='space-y-4'
				>
					{/* Заголовок */}
					<Title schedule={scheduleId!} profile={profile!} />

					{/* Описание */}
					<Description schedule={scheduleId!} profile={profile!} />

					{/* Кнопка "Вернуться" с иконкой */}
					<Link
						href={`${DASHBOARD_PAGES.SCHEDULE}`}
						className='flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors'
					>
						<ArrowLeft size={18} className='text-indigo-600' />
						Вернуться
					</Link>
				</m.div>
			</div>

			{/* Расписание по дням */}
			<>
				<div className='space-y-6'>
					{scheduleId?.schedule.groupTimetables &&
						Object.entries(scheduleId.schedule.groupTimetables).map(
							([groupKey, timetables], index) => (
								<m.div
									key={groupKey}
									variants={{
										hidden: { opacity: 0, y: 20 },
										visible: {
											opacity: 1,
											y: 0,
											transition: { staggerChildren: 0.2 },
										},
									}}
									initial='hidden'
									animate='visible'
									className='space-y-4'
								>
									{/* Заголовок для группы */}
									<m.div
										variants={{
											hidden: { opacity: 0, y: 20 },
											visible: {
												opacity: 1,
												y: 0,
												transition: { duration: 0.5 },
											},
										}}
										className='flex items-center gap-2 text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2'
									>
										<Users size={20} className='text-gray-600' />
										<span>Расписание для группы: {groupKey}</span>
									</m.div>

									{/* Расписание для группы */}
									<m.div
										variants={{
											hidden: { opacity: 0, y: 20 },
											visible: {
												opacity: 1,
												y: 0,
												transition: { duration: 0.5 },
											},
										}}
										className='bg-white rounded-lg shadow-md p-4 border border-gray-200'
									>
										<div className='flex items-center gap-2 mb-3'>
											<CalendarCheck size={20} className='text-gray-600' />
											<h5 className='text-base font-medium text-gray-700'>
												Занятия группы
											</h5>
										</div>
										<ScheduleLesson groupSchedule={timetables} />
									</m.div>
								</m.div>
							)
						)}
				</div>
			</>
		</div>
	);
};
