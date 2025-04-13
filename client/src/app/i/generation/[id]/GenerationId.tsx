"use client";
import { useProfile } from "@/hook/useProfile";
import { cabinetsAtom } from "@/jotai/schedule";
import { scheduleService } from "@/services/schedule.service";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Book, Briefcase, Building, UserIcon } from "lucide-react";
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
		if (schedule_id) {
			setCabinets(schedule_id.cabinets);
		}
	}, [schedule_id]);

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
				<CabinetForm profile={profile!} schedule={schedule_id} />

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
				{schedule_id.cabinets?.length > 0 && (
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
							{schedule_id?.cabinets.map(cabinet => (
								<div
									key={cabinet}
									className='px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium'
								>
									{cabinet}
								</div>
							))}
						</div>
					</m.div>
				)}

				{/* Список преподавателей */}
				{schedule_id.teachers?.length > 0 && (
					<m.div
						variants={{
							hidden: { opacity: 0, y: 20 },
							visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
						}}
					>
						<div className='flex items-center gap-2 mb-2'>
							<UserIcon size={18} className='text-gray-600' />
							<span className='text-sm font-medium text-gray-700'>
								Преподаватели:
							</span>
						</div>
						<div className='space-y-2'>
							{schedule_id?.teachers.map(teacher => (
								<div
									key={teacher.tid}
									className='flex items-center gap-2 text-gray-600'
								>
									<Briefcase size={16} />
									<span className='text-sm'>{teacher.name}</span>
								</div>
							))}
						</div>
					</m.div>
				)}

				{/* Список групп */}
				{schedule_id.groups?.length > 0 && (
					<m.div
						variants={{
							hidden: { opacity: 0, y: 20 },
							visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
						}}
					>
						<div className='flex items-center gap-2 mb-2'>
							<UserIcon size={18} className='text-gray-600' />
							<span className='text-sm font-medium text-gray-700'>Группы:</span>
						</div>
						<div className='flex flex-wrap gap-2'>
							{schedule_id?.groups.map(group => (
								<div
									key={group}
									className='px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium'
								>
									{group}
								</div>
							))}
						</div>
					</m.div>
				)}
			</m.div>
		)
	);
};
