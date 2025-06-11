"use client";

import { motion } from "framer-motion";
import { Calendar, Search } from "lucide-react";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { IGroupedDays, ILesson } from "@/types/schedule.type";

type Props = {
	groupedDays: IGroupedDays[];
};

export const SchedulesByDays = ({ groupedDays }: Props) => {
	const [weekIndex, setWeekIndex] = useState(0);
	const [activeDayIndex, setActiveDayIndex] = useState(0);
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredDays, setFilteredDays] = useState(groupedDays); // хранение отфильтрованных данных
	const [isSearching, setIsSearching] = useState(false);

	// 🔁 Используем debounce для поиска
	useEffect(() => {
		if (!groupedDays || groupedDays.length === 0) return;

		const timer = setTimeout(() => {
			if (searchTerm.trim() === "") {
				setFilteredDays(groupedDays);
				setIsSearching(false);
				return;
			}

			const lowerCaseSearch = searchTerm.toLowerCase();
			const result = groupedDays.filter(day =>
				day.lessons.some(
					lesson =>
						lesson.subject?.toLowerCase().includes(lowerCaseSearch) ||
						lesson.teacher?.toLowerCase().includes(lowerCaseSearch) ||
						lesson.group?.toLowerCase().includes(lowerCaseSearch)
				)
			);

			setFilteredDays(result);
			setIsSearching(false);
		}, 300);

		setIsSearching(true);
		return () => clearTimeout(timer);
	}, [searchTerm, groupedDays]);

	// Разбиваем на недели (по 5 дней)
	const daysPerWeek = 5;
	const weeks = [];
	for (let i = 0; i < filteredDays.length; i += daysPerWeek) {
		weeks.push({
			days: filteredDays.slice(i, i + daysPerWeek),
		});
	}

	// Обновляем weekIndex, если недель стало меньше
	useEffect(() => {
		if (weekIndex >= weeks.length && weeks.length > 0) {
			setWeekIndex(0);
		}
	}, [weeks.length]);

	// Получаем текущую неделю и день
	const currentWeek = weeks[weekIndex]?.days || [];
	const currentDay = currentWeek[activeDayIndex] || currentWeek[0] || null;

	return (
		<div className='mt-8 space-y-6'>
			{/* Поле поиска */}
			<motion.div
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.2 }}
				className='relative max-w-md mx-auto sm:mx-0'
			>
				<Search className='absolute left-3 top-3 h-5 w-5 text-gray-400' />
				<input
					type='text'
					placeholder='Поиск по предметам, преподавателям или группам...'
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
					className='pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand bg-white'
				/>
			</motion.div>

			{/* Сообщения о состоянии */}
			{searchTerm && !isSearching && filteredDays.length === 0 && (
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					className='text-center py-8 text-gray-500'
				>
					Ничего не найдено
				</motion.div>
			)}

			{searchTerm && isSearching && (
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					className='text-center py-4 text-gray-500 text-sm'
				>
					Поиск...
				</motion.div>
			)}

			{!searchTerm && groupedDays.length === 0 && (
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					className='text-center py-8 text-gray-500'
				>
					Расписание пустое
				</motion.div>
			)}

			{/* Свайпер дней недели */}
			{!searchTerm && (
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: 0.1 }}
					className='mb-6'
				>
					<h3 className='text-lg font-medium mb-3'>Выберите день</h3>
					<Swiper
						modules={[Navigation]}
						navigation
						slidesPerView={5}
						spaceBetween={10}
						className='schedule-days-swiper'
					>
						{currentWeek.map((day, index) => {
							const date = new Date(day.date);
							return (
								<SwiperSlide
									key={index}
									onClick={() => setActiveDayIndex(index)}
									className={`cursor-pointer text-center py-2 px-3 rounded-lg transition-all ${
										activeDayIndex === index
											? "bg-brand text-white"
											: "bg-gray-100 hover:bg-gray-200 text-gray-800"
									}`}
								>
									<span className='block font-medium'>{date.getDate()}</span>
									<span className='text-xs capitalize'>
										{date.toLocaleDateString("ru-RU", { weekday: "short" })}
									</span>
								</SwiperSlide>
							);
						})}
					</Swiper>
				</motion.div>
			)}

			{/* Расписание на день */}
			{!searchTerm && currentDay && (
				<motion.div
					key={activeDayIndex}
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 10 }}
					transition={{ duration: 0.3 }}
					className='mb-8'
				>
					<h2 className='text-xl font-semibold mb-4 flex items-center gap-2'>
						<Calendar className='w-5 h-5' />{" "}
						{new Date(currentDay.date).toLocaleDateString("ru-RU", {
							weekday: "long",
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</h2>

					<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
						{Array.from({ length: 6 }).map((_, idx) => {
							const lessonNumber = idx + 1;
							const lessonsForNumber = currentDay.lessons.filter(
								(l: ILesson) => l.lesson === lessonNumber
							);

							return (
								<motion.div
									key={`lesson-${lessonNumber}`}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									className={`p-4 border rounded-md min-h-[100px] ${
										lessonsForNumber.length > 0
											? "bg-white shadow-sm"
											: "bg-gray-50 italic text-gray-400"
									}`}
								>
									{lessonsForNumber.length > 0 ? (
										<>
											{lessonsForNumber.map((lesson, i) => (
												<div key={i} className='mb-2 last:mb-0'>
													<div>Каб. {lesson.cabinet || "-"}</div>
													<div>{lesson.subject || "-"}</div>
													<div className='text-sm text-gray-600'>
														{lesson.group}, {lesson.lessonType}
													</div>
													{i < lessonsForNumber.length - 1 && (
														<hr className='my-2 border-gray-200' />
													)}
												</div>
											))}
										</>
									) : (
										<span>Пара {lessonNumber}: свободно</span>
									)}
								</motion.div>
							);
						})}
					</div>
				</motion.div>
			)}

			{/* Результаты поиска */}
			{searchTerm && !isSearching && (
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
					className='mb-12'
				>
					<h2 className='text-xl font-semibold mb-4'>🗓 Результаты поиска</h2>

					<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
						{filteredDays.map((day, dayIndex) => {
							return (
								<div key={dayIndex} className='space-y-2'>
									<h4 className='font-medium text-center capitalize'>
										{new Date(day.date).toLocaleDateString("ru-RU", {
											weekday: "short",
											day: "numeric",
										})}
									</h4>
									{day.lessons.map((lesson, idx) => (
										<motion.div
											key={idx}
											whileHover={{ scale: 1.01 }}
											className='p-3 border rounded-md bg-white shadow-sm'
										>
											<div>Каб. {lesson.cabinet || "-"}</div>
											<div>{lesson.subject || "-"}</div>
											<div className='text-sm text-gray-600'>
												{lesson.group}, {lesson.lessonType}
											</div>
										</motion.div>
									))}
								</div>
							);
						})}
					</div>
				</motion.div>
			)}

			{/* Свайпер недель */}
			{!searchTerm && (
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: 0.2 }}
					className='mb-12'
				>
					<h2 className='text-xl font-semibold mb-4'>🗓 Недельное расписание</h2>

					<Swiper
						modules={[Navigation, Pagination]}
						navigation
						pagination={{ clickable: true }}
						onSlideChange={swiper => setWeekIndex(swiper.activeIndex)}
						spaceBetween={20}
						slidesPerView={1}
						className='week-swiper'
					>
						{weeks.map((week, index) => (
							<SwiperSlide key={index}>
								<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
									{week.days.map((day, dayIndex) => {
										const lessonsForDay = day.lessons;
										return (
											<div key={dayIndex} className='space-y-2'>
												<h4 className='font-medium text-center capitalize'>
													{new Date(day.date).toLocaleDateString("ru-RU", {
														weekday: "short",
														day: "numeric",
													})}
												</h4>
												{lessonsForDay.map((lesson, idx) => (
													<motion.div
														key={idx}
														whileHover={{ scale: 1.01 }}
														className='p-3 border rounded-md bg-white shadow-sm'
													>
														<div>Каб. {lesson.cabinet || "-"}</div>
														<div>{lesson.subject || "-"}</div>
														<div className='text-sm text-gray-600'>
															{lesson.group}, {lesson.lessonType}
														</div>
													</motion.div>
												))}
											</div>
										);
									})}
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				</motion.div>
			)}
		</div>
	);
};
