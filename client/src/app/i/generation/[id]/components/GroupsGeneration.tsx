import { useAddGroup } from "@/hook/useAddGroup";
import { groupsGenerationAtom } from "@/jotai/generation";
import { ISchedule } from "@/types/schedule.type";
import { IUser } from "@/types/user.type";
import { useAtom } from "jotai";
import { Filter, Search } from "lucide-react";
import { m } from "motion/react";
import { useState } from "react";

type Props = {
	profile: IUser | undefined;
	id: string;
	schedule: ISchedule | undefined;
};

export const GroupGeneration = ({ profile, id, schedule }: Props) => {
	const [groupsGeneration] = useAtom(groupsGenerationAtom);

	const [searchTerm, setSearchTerm] = useState("");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "numeric">("asc");

	// Объединяем группы из сервера и локальные
	const allGroups = [...(schedule?.groups || []), ...groupsGeneration];

	// Фильтр по названию
	const filteredGroups = allGroups.filter(group =>
		group.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Сортировка
	const sortedGroups = [...filteredGroups].sort((a, b) => {
		if (sortOrder === "asc")
			return a.localeCompare(b, undefined, { numeric: false });
		if (sortOrder === "desc")
			return b.localeCompare(a, undefined, { numeric: false });
		if (sortOrder === "numeric")
			return a.localeCompare(b, undefined, { numeric: true });
		return 0;
	});

	const { onSubmit, register, handleSubmit, errors } = useAddGroup(
		profile!,
		id
	);

	return (
		<div className='max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6'>
			<h1 className='text-2xl font-bold text-gray-800 mb-6'>Добавить группу</h1>

			{/* Форма добавления */}
			<div className='mb-8'>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='flex gap-3 flex-col sm:flex-row'
				>
					<div className='relative flex-1'>
						<input
							{...register("name", { required: true })}
							type='text'
							placeholder='Введите название группы'
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
						placeholder='Поиск по группам...'
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

			{/* Список групп */}
			<div>
				<h2 className='text-xl font-semibold text-gray-950 mb-4'>
					Список групп
				</h2>
				{sortedGroups.length > 0 ? (
					<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3'>
						{sortedGroups.map((group, index) => (
							<m.div
								key={index}
								initial={{ opacity: 0, y: 5 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -5 }}
								transition={{ duration: 0.2 }}
								className='bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-lg border border-gray-200 transition cursor-pointer'
							>
								<span className='text-gray-950'>{group}</span>
							</m.div>
						))}
					</div>
				) : (
					<p className='text-gray-500'>Группы не найдены</p>
				)}
			</div>
		</div>
	);
};
