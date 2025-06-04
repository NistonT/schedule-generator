"use client";

import { userService } from "@/services/user.service";
import { useQuery } from "@tanstack/react-query";
import { Activity, CalendarDays, MessageSquare, Users } from "lucide-react";
import { m } from "motion/react";

export const Statistic = () => {
	const { data, isError, isLoading } = useQuery({
		queryKey: ["user_all"],
		queryFn: () => userService.getAllUser(),
		select: data => data.data,
	});

	if (isLoading) {
		return (
			<div className='flex justify-center items-center h-64'>
				<p className='text-gray-500'>Загрузка статистики...</p>
			</div>
		);
	}

	if (isError || !data) {
		return (
			<div className='bg-red-100 text-red-700 p-4 rounded-md'>
				Ошибка загрузки данных
			</div>
		);
	}

	// Подсчет общей статистики
	const totalUsers = data.length;
	const totalVisits = data.reduce((sum, user) => sum + (user.visits || 0), 0);
	const totalFeedbacks = data.reduce(
		(sum, user) => sum + (user.feedback_count || 0),
		0
	);

	const totalSchedules = data.reduce((sum, user) => {
		return sum + (user.schedule?.length || 0);
	}, 0);

	return (
		<div className='p-4 space-y-6'>
			{/* Заголовок */}
			<h2 className='text-2xl font-bold text-gray-800 dark:text-white'>
				Статистика
			</h2>

			{/* Карточки статистики */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
				<StatCard
					title='Всего пользователей'
					value={totalUsers}
					icon={<Users />}
				/>
				<StatCard
					title='Всего посещений'
					value={totalVisits}
					icon={<Activity />}
				/>
				<StatCard
					title='Всего отзывов'
					value={totalFeedbacks}
					icon={<MessageSquare />}
				/>
				<StatCard
					title='Всего расписаний'
					value={totalSchedules}
					icon={<CalendarDays />}
				/>
			</div>

			{/* Таблица с пользователями */}
			<div className='mt-6 bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden'>
				<h3 className='text-lg font-semibold px-6 py-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700'>
					Пользователи
				</h3>
				<div className='overflow-x-auto'>
					<table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
						<thead className='bg-gray-50 dark:bg-gray-900'>
							<tr>
								<th className='px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300'>
									ID
								</th>
								<th className='px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300'>
									Имя
								</th>
								<th className='px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300'>
									Посещения
								</th>
								<th className='px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300'>
									Обратная связь
								</th>
								<th className='px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300'>
									Расписаний
								</th>
							</tr>
						</thead>
						<tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
							{data.map((user, idx) => (
								<tr
									key={idx}
									className='hover:bg-gray-50 dark:hover:bg-gray-700'
								>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
										{user.id}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
										{user.username || "Без имени"}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
										{user.visits || 0}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
										{user.feedback_count || 0}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200'>
										{user.schedule?.length || 0}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

// Компонент карточки статистики
interface StatCardProps {
	title: string;
	value: number;
	icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
	return (
		<m.div
			layout
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow'
		>
			<div className='p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'>
				{icon}
			</div>
			<div>
				<p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
					{title}
				</p>
				<p className='text-xl font-bold text-gray-800 dark:text-white'>
					{value}
				</p>
			</div>
		</m.div>
	);
};
