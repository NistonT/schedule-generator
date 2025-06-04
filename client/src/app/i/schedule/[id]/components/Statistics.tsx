"use client";
import { IGroupedDays, ISchedule } from "@/types/schedule.type";
import { motion } from "framer-motion";
import { BookOpen, Building, Calendar, Database, Users } from "lucide-react";
import { useState } from "react";

type Props = {
	schedule: ISchedule;
	totalLessons: number;
	groupedDays: IGroupedDays[];
	uniqueSubjects: string[];
	uniqueGroups: string[];
	uniqueCabinets: string[];
};

export const Statistics = ({
	schedule,
	totalLessons,
	groupedDays,
	uniqueSubjects,
	uniqueGroups,
	uniqueCabinets,
}: Props) => {
	const [expanded, setExpanded] = useState<{
		days: boolean;
		subjects: boolean;
		groups: boolean;
		cabinets: boolean;
	}>({
		days: false,
		subjects: false,
		groups: false,
		cabinets: false,
	});

	return (
		<div className='my-6'>
			{/* Сетка статистики */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4'>
				{/* Дата создания */}
				<motion.div
					layout
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 cursor-default'
				>
					<Database className='w-5 h-5 text-blue-500 mb-2' />
					<p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
						Дата создания
					</p>
					<p className='text-lg font-semibold text-gray-800 dark:text-gray-100'>
						{new Date(schedule.CreatedAt).toLocaleDateString()}
					</p>
				</motion.div>

				{/* Дата обновления */}
				<motion.div
					layout
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 cursor-default'
				>
					<Calendar className='w-5 h-5 text-purple-500 mb-2' />
					<p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
						Обновлено
					</p>
					<p className='text-lg font-semibold text-gray-800 dark:text-gray-100'>
						{new Date(schedule.UpdatedAt).toLocaleDateString()}
					</p>
				</motion.div>

				{/* ID расписания */}
				<motion.div
					layout
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 cursor-default'
				>
					<Database className='w-5 h-5 text-green-500 mb-2' />
					<p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
						ID
					</p>
					<p className='text-lg font-semibold text-gray-800 dark:text-gray-100'>
						{schedule.id}
					</p>
				</motion.div>

				{/* Статус */}
				<motion.div
					layout
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 cursor-default'
				>
					<BookOpen className='w-5 h-5 text-yellow-500 mb-2' />
					<p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
						Статус
					</p>
					<p className='text-lg font-semibold text-gray-800 dark:text-gray-100'>
						{schedule.isShow ? "Активно" : "Скрыто"}
					</p>
				</motion.div>

				{/* Всего часов */}
				<motion.div
					layout
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 cursor-default'
				>
					<BookOpen className='w-5 h-5 text-indigo-500 mb-2' />
					<p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
						Всего часов
					</p>
					<p className='text-lg font-semibold text-gray-800 dark:text-gray-100'>
						{totalLessons}
					</p>
				</motion.div>

				{/* Дни */}
				<motion.div
					layout
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 cursor-pointer transition-transform hover:scale-105'
					onClick={() => setExpanded(prev => ({ ...prev, days: !prev.days }))}
				>
					<Calendar className='w-5 h-5 text-pink-500 mb-2' />
					<p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
						Дней
					</p>
					<p className='text-lg font-semibold text-gray-800 dark:text-gray-100'>
						{groupedDays.length}
					</p>

					{/* Раскрытые дни */}
					{expanded.days && (
						<motion.div
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: "auto", opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							className='mt-2 overflow-hidden space-y-1 text-sm text-gray-700 dark:text-gray-300'
						>
							{groupedDays.map((day, idx) => (
								<div key={idx}>{day.date}</div>
							))}
						</motion.div>
					)}
				</motion.div>

				{/* Предметы */}
				<motion.div
					layout
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 cursor-pointer transition-transform hover:scale-105'
					onClick={() =>
						setExpanded(prev => ({ ...prev, subjects: !prev.subjects }))
					}
				>
					<BookOpen className='w-5 h-5 text-red-500 mb-2' />
					<p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
						Предметы
					</p>
					<p className='text-lg font-semibold text-gray-800 dark:text-gray-100'>
						{uniqueSubjects.length}
					</p>

					{/* Раскрытые предметы */}
					{expanded.subjects && (
						<motion.div
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: "auto", opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							className='mt-2 overflow-hidden space-y-1 text-sm text-gray-700 dark:text-gray-300'
						>
							{uniqueSubjects.map((subject, idx) => (
								<div key={idx}>{subject}</div>
							))}
						</motion.div>
					)}
				</motion.div>

				{/* Группы */}
				<motion.div
					layout
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 cursor-pointer transition-transform hover:scale-105'
					onClick={() =>
						setExpanded(prev => ({ ...prev, groups: !prev.groups }))
					}
				>
					<Users className='w-5 h-5 text-teal-500 mb-2' />
					<p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
						Группы
					</p>
					<p className='text-lg font-semibold text-gray-800 dark:text-gray-100'>
						{uniqueGroups.length}
					</p>

					{/* Раскрытые группы */}
					{expanded.groups && (
						<motion.div
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: "auto", opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							className='mt-2 overflow-hidden space-y-1 text-sm text-gray-700 dark:text-gray-300'
						>
							{uniqueGroups.map((group, idx) => (
								<div key={idx}>{group}</div>
							))}
						</motion.div>
					)}
				</motion.div>

				{/* Кабинеты */}
				<motion.div
					layout
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 cursor-pointer transition-transform hover:scale-105'
					onClick={() =>
						setExpanded(prev => ({ ...prev, cabinets: !prev.cabinets }))
					}
				>
					<Building className='w-5 h-5 text-cyan-500 mb-2' />
					<p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
						Кабинеты
					</p>
					<p className='text-lg font-semibold text-gray-800 dark:text-gray-100'>
						{uniqueCabinets.length}
					</p>

					{/* Раскрытые кабинеты */}
					{expanded.cabinets && (
						<motion.div
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: "auto", opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							className='mt-2 overflow-hidden space-y-1 text-sm text-gray-700 dark:text-gray-300'
						>
							{uniqueCabinets.map((cabinet, idx) => (
								<div key={idx}>{cabinet}</div>
							))}
						</motion.div>
					)}
				</motion.div>
			</div>
		</div>
	);
};
