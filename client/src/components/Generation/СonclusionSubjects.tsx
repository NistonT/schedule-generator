// ConclusionSubjects.tsx

"use client";

import { CombinedRecord } from "@/types/schedule.type";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Hash, ListFilter, Search, Trash2, X } from "lucide-react";
import { useState } from "react";
import { GroupIcon, TeacherIcon } from "./IconConclusionSubjects";

type Props = {
	combinedRecords: CombinedRecord[];
	handleRemoveAmountLimit: (index: number) => void;
};

export const ConclusionSubjects = ({
	combinedRecords,
	handleRemoveAmountLimit,
}: Props) => {
	const [showAll, setShowAll] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

	// Получаем уникальные группы из записей
	const uniqueGroups = Array.from(
		new Set(combinedRecords.map(r => r.group.split("-")[0]))
	).filter(Boolean);

	// Фильтруем записи
	const filteredRecords = combinedRecords.filter(record => {
		const groupFilter = selectedGroup
			? record.group.startsWith(selectedGroup)
			: true;
		const searchFilter = record.subject
			.toLowerCase()
			.includes(searchTerm.toLowerCase());

		return groupFilter && searchFilter;
	});

	// Сброс фильтров
	const resetFilters = () => {
		setSearchTerm("");
		setSelectedGroup(null);
	};

	// Подсчёт общего количества часов
	const totalHours = filteredRecords.reduce(
		(acc, record) => acc + record.amount,
		0
	);

	return (
		<div className='mb-6'>
			<h3 className='text-lg font-semibold text-gray-800 mb-3'>
				Добавленные предметы
			</h3>

			{/* Поиск и фильтр */}
			<motion.div
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				className='flex flex-col sm:flex-row gap-3 mb-4 bg-white p-4 rounded-lg shadow-sm'
			>
				<div className='relative flex-1'>
					<input
						type='text'
						placeholder='Поиск предмета...'
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
						className='w-full px-9 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
					/>
					<Search size={16} className='absolute left-2 top-2.5 text-gray-400' />
				</div>

				{uniqueGroups.length > 0 && (
					<div className='flex items-center gap-2'>
						<ListFilter size={18} className='text-gray-400' />
						<select
							value={selectedGroup || ""}
							onChange={e => setSelectedGroup(e.target.value || null)}
							className='px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none'
						>
							<option value=''>Все группы</option>
							{uniqueGroups.map(group => (
								<option key={group} value={group}>
									{group}
								</option>
							))}
						</select>
					</div>
				)}

				{(searchTerm || selectedGroup) && (
					<button
						onClick={resetFilters}
						title='Сбросить фильтры'
						className='p-2 text-gray-500 hover:text-red-500 transition-colors'
					>
						<X size={18} />
					</button>
				)}
			</motion.div>

			{/* Общее количество часов */}
			{filteredRecords.length > 0 && (
				<div className='mb-4 text-sm text-gray-600'>
					Общее количество часов:{" "}
					<span className='font-semibold'>{totalHours}</span>
				</div>
			)}

			{/* Режим по умолчанию: максимум 3 элемента + горизонтальная прокрутка */}
			<AnimatePresence mode='wait'>
				{!showAll && (
					<motion.div
						key='short-list'
						initial='hidden'
						animate='visible'
						exit='exit'
						variants={{
							hidden: { opacity: 0, y: 10 },
							visible: { opacity: 1, y: 0 },
							exit: { opacity: 0, y: -10 },
						}}
						transition={{ duration: 0.3 }}
					>
						{/* Горизонтальная прокрутка на мобильных */}
						<div className='overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide'>
							<div className='inline-flex gap-4'>
								{filteredRecords.slice(0, 3).map((record, index) => (
									<motion.div
										key={index}
										initial={{ opacity: 0, x: 20 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -20 }}
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.95 }}
										className='bg-white border border-gray-200 rounded-xl shadow-sm w-[200px] min-w-[200px] max-w-xs flex-shrink-0 p-4'
									>
										<div>
											<p className='font-medium text-gray-900 truncate'>
												{record.subject}
											</p>
											<ul className='text-sm text-gray-500 mt-2 space-y-1'>
												<li className='flex items-center gap-1'>
													<GroupIcon /> <span>Группа: {record.group}</span>
												</li>
												<li className='flex items-center gap-1'>
													<TeacherIcon />{" "}
													<span>
														Преподаватель:{" "}
														<strong>
															{record.teacherName || "Не назначен"}
														</strong>
													</span>
												</li>
												<li className='flex items-center gap-1'>
													<BookOpen size={14} /> Тип:{" "}
													{record.lessonType === "L"
														? "Лекция"
														: record.lessonType === "1"
														? "Подгруппа 1"
														: "Подгруппа 2"}
												</li>
												<li className='flex items-center gap-1'>
													<Hash size={14} /> Кол-во:{" "}
													<strong>{record.amount}</strong>
												</li>
											</ul>
										</div>
										<button
											type='button'
											onClick={() => handleRemoveAmountLimit(index)}
											className='mt-3 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors'
											title='Удалить предмет'
										>
											<Trash2 size={18} />
										</button>
									</motion.div>
								))}
							</div>
						</div>

						{/* Кнопка показать всё */}
						{combinedRecords.length > 3 && (
							<motion.button
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.2 }}
								type='button'
								onClick={() => setShowAll(true)}
								className='mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors w-full max-w-xs mx-auto sm:mx-0'
							>
								Показать все {combinedRecords.length} предметов
							</motion.button>
						)}
					</motion.div>
				)}

				{/* Режим "Все предметы" */}
				{showAll && (
					<motion.div
						key='full-list'
						initial='hidden'
						animate='visible'
						exit='exit'
						variants={{
							hidden: { opacity: 0, y: 10 },
							visible: { opacity: 1, y: 0 },
							exit: { opacity: 0, y: -10 },
						}}
						transition={{ duration: 0.3 }}
						className='space-y-4'
					>
						{/* Грид со всеми записями */}
						<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
							{filteredRecords.map((record, index) => (
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.95 }}
									key={index}
									className='bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow'
								>
									<div>
										<p className='font-medium text-gray-900 truncate'>
											{record.subject}
										</p>
										<ul className='text-sm text-gray-600 mt-1 space-y-1'>
											<li className='flex items-center gap-1'>
												<GroupIcon /> <span>Группа: {record.group}</span>
											</li>
											<li className='flex items-center gap-1'>
												<TeacherIcon /> Преподаватель:{" "}
												<strong>{record.teacherName || "Не назначен"}</strong>
											</li>
											<li className='flex items-center gap-1'>
												<BookOpen size={14} /> Тип:{" "}
												{record.lessonType === "L"
													? "Лекция"
													: record.lessonType === "1"
													? "Подгруппа 1"
													: "Подгруппа 2"}
											</li>
											<li className='flex items-center gap-1'>
												<Hash size={14} /> Кол-во:{" "}
												<strong>{record.amount}</strong>
											</li>
										</ul>
									</div>
									<button
										type='button'
										onClick={() => handleRemoveAmountLimit(index)}
										className='mt-3 self-start p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors'
										title='Удалить предмет'
									>
										<Trash2 size={16} />
									</button>
								</motion.div>
							))}
						</div>

						{/* Кнопка скрыть */}
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							type='button'
							onClick={() => setShowAll(false)}
							className='mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors w-full max-w-xs mx-auto sm:ml-auto'
						>
							Скрыть
						</motion.button>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
