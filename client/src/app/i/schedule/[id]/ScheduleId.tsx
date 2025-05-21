"use client";
import { Loading } from "@/components/Loading";
import { useProfile } from "@/hook/useProfile";
import { useStatisticsSubjectsAndCountByGroupsByDays } from "@/hook/useStatisticsSubjectsAndCountByGroupsByDays";
import { scheduleService } from "@/services/schedule.service";
import { useQuery } from "@tanstack/react-query";
import { SchedulesByDays } from "./components/SchedulesByDay";
import { Statistics } from "./components/Statistics";
import { SubjectsAndCount } from "./components/SubjectsAndCount";
import { SubjectsByGroups } from "./components/SubjectsByGroups";

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
					<h1 className='text-2xl font-bold mb-4'>{schedule!.title}</h1>
					<p>{schedule!.description}</p>

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
