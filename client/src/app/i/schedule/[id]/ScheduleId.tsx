"use client";
import { Loading } from "@/components/Loading";
import { useProfile } from "@/hook/useProfile";
import { useStatisticsSubjectsAndCountByGroupsByDays } from "@/hook/useStatisticsSubjectsAndCountByGroupsByDays";
import { scheduleService } from "@/services/schedule.service";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { m } from "motion/react";
import { DeleteSchedule } from "./components/DeleteSchedulle";
import { Description } from "./components/Description";
import { IsShow } from "./components/IsShow";
import { SchedulesByDays } from "./components/SchedulesByDay";
import { Statistics } from "./components/Statistics";
import { SubjectsAndCount } from "./components/SubjectsAndCount";
import { SubjectsByGroups } from "./components/SubjectsByGroups";
import { Title } from "./components/Title";

type Props = {
	id: string;
};

export const ScheduleId = ({ id: scheduleId }: Props) => {
	const { data: profile } = useProfile();

	const {
		data: schedule,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["get_scheduleId"],
		queryFn: () => scheduleService.getSchedule(profile!.api_key, scheduleId),
		select: data => data.data,
	});

	const {
		totalLessons,
		lessonsByGroup,
		groupedDays,
		subjectCountList,
		uniqueSubjects,
		uniqueGroups,
		uniqueCabinets,
	} = useStatisticsSubjectsAndCountByGroupsByDays(schedule!);

	return (
		<div className='p-4'>
			{!isLoading && !isError ? (
				<>
					<Title schedule={schedule!} apiKey={profile!.api_key} />
					<Description schedule={schedule!} apiKey={profile!.api_key} />
					<div className='flex flex-wrap items-center gap-3'>
						{/* Показать / Скрыто */}
						<IsShow schedule={schedule!} apiKey={profile!.api_key} />

						{/* Удаление (теперь компонент DeleteSchedule принимает profile) */}
						<DeleteSchedule schedule={schedule!} profile={profile!} />

						{/* Кнопка "Перейти к расписанию" */}
						<m.a
							href={`http://localhost:5555/api/schedule?api-key=${
								profile!.api_key
							}&schedule_id=${schedule!.id}`}
							target='_blank'
							rel='noopener noreferrer'
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className='inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition'
						>
							Перейти к расписанию
							<ExternalLink className='w-4 h-4' />
						</m.a>
					</div>

					{/* Статистика */}
					<Statistics
						schedule={schedule!}
						totalLessons={totalLessons}
						groupedDays={groupedDays}
						uniqueSubjects={uniqueSubjects}
						uniqueGroups={uniqueGroups}
						uniqueCabinets={uniqueCabinets}
					/>

					{/* Таблица предметов и количество уроков */}
					<SubjectsAndCount subjectCountList={subjectCountList} />

					{/* Предметы по группам */}
					<SubjectsByGroups lessonsByGroup={lessonsByGroup} />

					{/* Расписание по дням */}
					<SchedulesByDays groupedDays={groupedDays} />
				</>
			) : isError ? (
				<div>Ошибка загрузки расписания</div>
			) : (
				<Loading />
			)}
		</div>
	);
};
