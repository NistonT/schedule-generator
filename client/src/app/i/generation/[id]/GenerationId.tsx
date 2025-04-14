"use client";
import { useProfile } from "@/hook/useProfile";
import { cabinetsAtom } from "@/jotai/schedule";
import { scheduleService } from "@/services/schedule.service";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Book, Building } from "lucide-react";
import { m } from "motion/react";
import { useEffect } from "react";
import { CabinetForm } from "./components/CabinetForm";

type Props = {
	id: number;
};

export const GenerationId = ({ id }: Props) => {
	const { data: profile } = useProfile();
	const [cabinets, setCabinets] = useAtom(cabinetsAtom);

	const { data: schedule_id } = useQuery({
		queryKey: ["schedule_id"],
		queryFn: () => scheduleService.getSchedule(profile!.api_key, String(id)),
		select: data => data.data,
	});

	useEffect(() => {
		if (schedule_id?.cabinets) {
			setCabinets(schedule_id.cabinets); // Устанавливаем кабинеты для текущего расписания
		} else {
			setCabinets([]); // Очищаем состояние, если данных нет
		}
	}, [id, schedule_id, setCabinets]);

	return (
		schedule_id && (
			<m.div
				variants={{
					hidden: { opacity: 0, y: 20 },
					visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
				}}
				initial='hidden'
				animate='visible'
				className='p-6 bg-white rounded-lg shadow-md space-y-6 max-w-2xl mx-auto'
			>
				{/* Форма для добавления кабинетов */}
				<CabinetForm
					profile={profile!}
					schedule={schedule_id}
					onCabinetAdded={newCabinets => {
						setCabinets(prev => {
							// Удаляем дубликаты и добавляем только уникальные кабинеты
							const uniqueCabinets = Array.from(
								new Set([...(prev || []), ...newCabinets])
							);
							return uniqueCabinets;
						});
					}}
				/>

				{/* Заголовок расписания */}
				<m.div
					variants={{
						hidden: { opacity: 0, y: 20 },
						visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
					}}
				>
					<h2 className='text-xl font-bold text-gray-800 flex items-center gap-2'>
						<Book size={20} className='text-indigo-600' />
						{schedule_id.title}
					</h2>
				</m.div>

				{/* Список кабинетов */}
				{cabinets.length > 0 && (
					<m.div
						variants={{
							hidden: { opacity: 0, y: 20 },
							visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
						}}
					>
						<div className='flex items-center gap-2 mb-2'>
							<Building size={18} className='text-gray-600' />
							<span className='text-sm font-medium text-gray-700'>
								Кабинеты:
							</span>
						</div>
						<div className='flex flex-wrap gap-2'>
							{cabinets.map((cabinet, index) => (
								<div
									key={index}
									className='px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium'
								>
									{cabinet}
								</div>
							))}
						</div>
					</m.div>
				)}

				{/* Остальной код (преподаватели, группы и т.д.) оставлен без изменений */}
			</m.div>
		)
	);
};
