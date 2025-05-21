import { ILesson, ISchedule } from "@/types/schedule.type";

interface IStatisticsResult {
	totalDays: number; // Общее количество дней
	totalLessons: number; // Общее количество уроков
	lessonsByDate: Map<string, ILesson[]>; // Уроки сгруппированные по дате
	lessonsByGroup: Map<string, Map<string, number>>; // Уроки сгруппированные по группам (с количеством)
	groupedDays: { date: string; lessons: ILesson[] }[]; // Дни с уроками
	subjectCountMap: Map<string, number>; // Количество уроков по предметам (Map)
	subjectCountList: [string, number][]; // Количество уроков по предметам (отсортированный массив)
	uniqueSubjects: string[]; // Уникальные предметы
	uniqueGroups: string[]; // Уникальные группы
	uniqueCabinets: string[]; // Уникальные кабинеты
}

const EMPTY_STATISTICS: IStatisticsResult = {
	totalDays: 0,
	totalLessons: 0,
	lessonsByDate: new Map(),
	lessonsByGroup: new Map(),
	groupedDays: [],
	subjectCountMap: new Map(),
	subjectCountList: [],
	uniqueSubjects: [],
	uniqueGroups: [],
	uniqueCabinets: [],
};

export const useStatisticsSubjectsAndCountByGroupsByDays = (
	schedule: ISchedule | null
): IStatisticsResult => {
	if (!schedule || !schedule.schedule?.schedule) return EMPTY_STATISTICS;

	// Общая статистика
	const totalDays = schedule.schedule.schedule.length;
	const totalLessons = schedule.schedule.schedule.reduce(
		(acc, day) => acc + day.length,
		0
	);

	// Группируем все уроки по дате, чтобы объединить одинаковые дни
	const lessonsByDate = new Map<string, ILesson[]>();

	schedule.schedule.schedule.forEach(dayLessons => {
		dayLessons.forEach(lesson => {
			const date = lesson.date;
			if (!lessonsByDate.has(date)) {
				lessonsByDate.set(date, []);
			}
			lessonsByDate.get(date)?.push(lesson);
		});
	});

	const groupedDays = Array.from(lessonsByDate.entries()).map(
		([date, lessons]) => ({
			date,
			lessons,
		})
	);

	// Подсчёт предметов, групп и кабинетов
	const subjectCountMap = new Map<string, number>();
	const groupSet = new Set<string>();
	const cabinetSet = new Set<string>();

	schedule.schedule.schedule.flat().forEach(lesson => {
		if (lesson.subject) {
			subjectCountMap.set(
				lesson.subject,
				(subjectCountMap.get(lesson.subject) || 0) + 1
			);
		}
		if (lesson.group) {
			groupSet.add(lesson.group);
		}
		if (lesson.cabinet) {
			cabinetSet.add(lesson.cabinet);
		}
	});

	const subjectCountList = Array.from(subjectCountMap.entries()).sort(
		(a, b) => b[1] - a[1]
	);
	const uniqueSubjects = Array.from(
		new Set(
			schedule.schedule.schedule
				.flat()
				.map(l => l.subject)
				.filter(Boolean)
		)
	);
	const uniqueGroups = Array.from(groupSet);
	const uniqueCabinets = Array.from(cabinetSet);

	// Группировка по группам для отображения предметов на группу
	const lessonsByGroup = new Map<string, Map<string, number>>();

	schedule.schedule.schedule.flat().forEach(lesson => {
		if (!lesson.group || !lesson.subject) return;

		const group = lesson.group;
		const subject = lesson.subject;

		if (!lessonsByGroup.has(group)) {
			lessonsByGroup.set(group, new Map<string, number>());
		}

		const groupMap = lessonsByGroup.get(group)!;
		groupMap.set(subject, (groupMap.get(subject) || 0) + 1);
	});

	return {
		totalDays,
		totalLessons,
		lessonsByDate,
		lessonsByGroup,
		groupedDays,
		subjectCountMap,
		subjectCountList,
		uniqueSubjects,
		uniqueGroups,
		uniqueCabinets,
	};
};
