"use client";
import { DASHBOARD_PAGES } from "@/config/pages-url.config";
import { useGetAllUsersSchedule } from "@/hook/useGetAllUsersSchedule";
import { useProfile } from "@/hook/useProfile";
import {
	ArrowRightIcon,
	CalendarIcon,
	ClipboardList,
	Search,
} from "lucide-react";
import { m } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { IsShow } from "./components/IsShow";

export const Schedule = () => {
	const { data: profile } = useProfile();
	const { list_schedule, isLoading, isError } = useGetAllUsersSchedule(
		profile!
	);
	const [searchTerm, setSearchTerm] = useState("");
	const [showHidden, setShowHidden] = useState(false);
	const [filter, setFilter] = useState<"all" | "active" | "hidden">("all");

	if (isLoading) return <div>Загрузка...</div>;
	if (isError) return <div>Ошибка</div>;

	// Фильтруем расписания
	const filteredList = list_schedule?.filter(schedule => {
		const matchesSearch =
			schedule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			schedule.description.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesFilter =
			filter === "all"
				? true
				: filter === "active"
				? schedule.isShow
				: !schedule.isShow;

		return matchesSearch && matchesFilter;
	});

	return (
		<div className='space-y-6'>
			{/* Поиск */}
			<div className='relative max-w-md mx-auto sm:mx-0'>
				<Search className='absolute left-3 top-3.5 h-5 w-5 text-gray-400' />
				<input
					type='text'
					placeholder='Поиск по названию или описанию...'
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
					className='pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand'
				/>
			</div>

			{/* Фильтр */}
			<div className='flex flex-wrap gap-2 justify-center sm:justify-start'>
				<button
					type='button'
					onClick={() => setFilter("all")}
					className={`px-4 py-1 text-sm rounded-full border ${
						filter === "all"
							? "bg-brand text-white border-transparent"
							: "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
					}`}
				>
					Все
				</button>
				<button
					type='button'
					onClick={() => setFilter("active")}
					className={`px-4 py-1 text-sm rounded-full border ${
						filter === "active"
							? "bg-gray-600 text-white border-transparent"
							: "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
					}`}
				>
					Активные
				</button>
				<button
					type='button'
					onClick={() => setFilter("hidden")}
					className={`px-4 py-1 text-sm rounded-full border ${
						filter === "hidden"
							? "bg-gray-600 text-white border-transparent"
							: "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
					}`}
				>
					Скрытые
				</button>
			</div>

			{/* Список расписаний */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{filteredList!.length > 0 ? (
					filteredList!.map((schedule, index) => {
						return (
							<m.div
								key={schedule.id}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 10 }}
								transition={{ duration: 0.3 }}
								className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow'
							>
								<div className='p-5'>
									<div className='flex justify-between items-start mb-3'>
										<m.div
											initial={{ opacity: 0, y: 5 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.2 }}
											className='flex justify-between items-start mb-4'
										>
											<div className='flex items-center gap-3'>
												<ClipboardList className='w-6 h-6 text-gray-500' />
												<h2 className='text-xl font-bold text-gray-950'>
													{schedule.title}
												</h2>
											</div>
											<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-950'>
												ID: {schedule.id}
											</span>
										</m.div>
									</div>

									<IsShow schedule={schedule} apiKey={profile!.api_key} />

									<p className='text-gray-600 mb-4 line-clamp-2'>
										{schedule.description}
									</p>

									<div className='grid grid-cols-2 gap-3 mb-4 text-sm'>
										<div className='flex items-center text-gray-500'>
											<CalendarIcon className='w-4 h-4 mr-2' />
											<span>
												Создано:{" "}
												{new Date(schedule.CreatedAt).toLocaleDateString()}
											</span>
										</div>
										<div className='flex items-center text-gray-500'>
											<span>
												Обновлено:{" "}
												{new Date(schedule.UpdatedAt).toLocaleDateString()}
											</span>
										</div>
										<div className='flex items-center'>
											<span className='font-medium'>
												{schedule.schedule_count} генераций
											</span>
										</div>
										<div className='flex items-center text-gray-500'>
											<span>ID: {schedule.id}</span>
										</div>
									</div>

									<Link
										href={`${DASHBOARD_PAGES.SCHEDULE_ID}${schedule.id}`}
										className='w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-950 mt-4'
									>
										Перейти
										<ArrowRightIcon className='w-4 h-4 ml-2' />
									</Link>
								</div>
							</m.div>
						);
					})
				) : (
					<p className='text-gray-500 col-span-full text-center py-4'>
						Расписаний не найдено
					</p>
				)}
			</div>

			{/* Кнопка показать/скрыть скрытые расписания */}
			{filter === "all" && (
				<div className='mt-6 text-center'>
					<button
						type='button'
						onClick={() => setShowHidden(!showHidden)}
						className='text-sm text-brand hover:underline'
					>
						{showHidden ? "Скрыть архивные" : "Показать архивные"}
					</button>
				</div>
			)}

			{/* Архивные расписания */}
			{showHidden && filter === "all" && (
				<>
					<h3 className='text-lg font-semibold text-gray-700 mt-8'>
						Архивные расписания
					</h3>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{list_schedule!
							.filter(s => !s.isShow)
							.map(schedule => (
								<m.div
									key={schedule.id}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.3 }}
									className='bg-gray-50 rounded-lg border border-dashed border-gray-300 p-5 text-center'
								>
									<h4 className='text-lg font-semibold text-gray-800'>
										{schedule.title}
									</h4>
									<p className='text-sm text-gray-500 mt-1'>
										{schedule.description}
									</p>
									<button
										onClick={() => setShowHidden(false)}
										className='mt-4 inline-block text-gray-950 hover:text-gray-800'
									>
										Показать в списке
									</button>
								</m.div>
							))}
					</div>
				</>
			)}
		</div>
	);
};
