import { motion } from "framer-motion";
import { Filter, Search } from "lucide-react";
import { useState } from "react";

import { useAddTeacher } from "@/hook/useAddTeacher";
import { teachersGenerationAtom } from "@/jotai/generation";
import { ISchedule } from "@/types/schedule.type";
import { IUser } from "@/types/user.type";
import { useAtom } from "jotai";

type Props = {
	profile: IUser | undefined;
	id: string;
	schedule: ISchedule | undefined;
};

export const TeacherGeneration = ({ profile, id, schedule }: Props) => {
	const [teachersGeneration] = useAtom(teachersGenerationAtom);

	const [searchTerm, setSearchTerm] = useState("");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "numeric">("asc");
	const [isExpanded, setIsExpanded] = useState(false);

	// Объединяем преподавателей из сервера и локальные
	const allTeachers = [...(schedule?.teachers || []), ...teachersGeneration];

	// Фильтр по имени
	const filteredTeachers = allTeachers.filter(teacher =>
		teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Сортировка
	const sortedTeachers = [...filteredTeachers].sort((a, b) => {
		if (sortOrder === "asc")
			return a.name.localeCompare(b.name, undefined, { numeric: false });
		if (sortOrder === "desc")
			return b.name.localeCompare(a.name, undefined, { numeric: false });
		if (sortOrder === "numeric")
			return a.name.localeCompare(b.name, undefined, { numeric: true });
		return 0;
	});

	const limit = isExpanded ? sortedTeachers.length : 5;

	const { onSubmit, register, handleSubmit, errors } = useAddTeacher(
		profile!,
		id
	);

	return (
		<div className='max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6'>
			<h1 className='text-2xl font-bold text-gray-800 mb-6'>
				Добавить преподавателя
			</h1>

			{/* Форма добавления */}
			<div className='mb-8'>
				<form
					className='flex gap-3 flex-col sm:flex-row'
					onSubmit={handleSubmit(onSubmit)}
				>
					<div className='relative flex-1'>
						<input
							{...register("name", { required: true })}
							type='text'
							placeholder='Введите имя преподавателя'
							className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300'
						/>
					</div>
					<button
						type='submit'
						className='px-6 py-2 bg-gray-950 text-white font-medium rounded-lg hover:bg-gray-800 transition'
					>
						Добавить
					</button>
				</form>
			</div>

			{/* Поиск и фильтры */}
			<div className='mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
				<div className='relative w-full sm:w-1/2'>
					<Search className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
					<input
						type='text'
						placeholder='Поиск по преподавателям...'
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
						className='pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand'
					/>
				</div>

				<div className='flex items-center gap-2 w-full sm:w-auto'>
					<Filter className='h-5 w-5 text-gray-400' />
					<select
						value={sortOrder}
						onChange={e =>
							setSortOrder(e.target.value as "asc" | "desc" | "numeric")
						}
						className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand'
					>
						<option value='asc'>A → Z</option>
						<option value='desc'>Z → A</option>
						<option value='numeric'>Числа от меньшего к большему</option>
					</select>
				</div>
			</div>

			{/* Список преподавателей */}
			<div>
				<h2 className='text-xl font-semibold text-gray-700 mb-4'>
					Список преподавателей
				</h2>

				{sortedTeachers.length === 0 ? (
					<p className='text-gray-500'>Нет преподавателей</p>
				) : (
					<>
						{/* Кнопка Показать все / Скрыть */}
						{sortedTeachers.length > 5 && (
							<button
								type='button'
								onClick={() => setIsExpanded(!isExpanded)}
								className='mt-2 text-xs text-brand hover:underline'
							>
								{isExpanded
									? "Скрыть"
									: `Показать все (${sortedTeachers.length})`}
							</button>
						)}

						{/* Преподаватели */}
						<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4'>
							{sortedTeachers.slice(0, limit).map(teacher => (
								<motion.div
									key={teacher.tid}
									initial={{ opacity: 0, y: 5 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -5 }}
									transition={{ duration: 0.2 }}
									className='bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-lg border border-gray-200 cursor-pointer transition'
								>
									<span className='text-gray-950'>{teacher.name}</span>
								</motion.div>
							))}
						</div>
					</>
				)}
			</div>
		</div>
	);
};
