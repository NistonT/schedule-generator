"use client";

import { ScheduleLesson } from "@/components/ScheduleFull/ScheduleLesson";
import { DASHBOARD_PAGES } from "@/config/pages-url.config";
import { useProfile } from "@/hook/useProfile";
import { scheduleAtom } from "@/jotai/schedule";
import { scheduleService } from "@/services/schedule.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import {
	ArrowLeft,
	CalendarCheck,
	ChevronDown,
	ChevronUp,
	Users,
} from "lucide-react";
import { m } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Description } from "./components/Description";
import { Title } from "./components/Title";

type Props = {
	id: number;
};

export const ScheduleId = ({ id }: Props) => {
	const [scheduleId, setScheduleId] = useAtom(scheduleAtom);
	const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
		{}
	);
	const { data: profile } = useProfile();
	const { push } = useRouter();

	// Состояния для модального окна
	const [isModalOpen, setIsModalOpen] = useState(false); // Открыто ли модальное окно
	const [confirmationInput, setConfirmationInput] = useState(""); // Ввод пользователя

	// Состояние для поискового запроса
	const [searchQuery, setSearchQuery] = useState(""); // Поиск по названию группы

	const { mutate } = useMutation({
		mutationKey: ["delete_schedule"],
		mutationFn: () =>
			scheduleService.deleteSchedule(profile!.api_key, String(id)),
		onSuccess: () => {
			toast.success("Расписание удалено");
			push(DASHBOARD_PAGES.SCHEDULE);
		},
		onError: error => {
			toast.error(error.message);
		},
	});

	const { data: schedule_id } = useQuery({
		queryKey: ["schedule_get"],
		queryFn: () => scheduleService.getSchedule(profile!.api_key, String(id)),
		select: data => data.data,
	});

	useEffect(() => {
		if (schedule_id) {
			setScheduleId(schedule_id);

			const initialExpandedState: Record<string, boolean> = {};
			if (schedule_id?.schedule.groupTimetables) {
				Object.keys(schedule_id.schedule.groupTimetables).forEach(groupKey => {
					initialExpandedState[groupKey] = true;
				});
			}
			setExpandedGroups(initialExpandedState);
		}
	}, [schedule_id]);

	const toggleGroup = (groupKey: string) => {
		setExpandedGroups(prev => ({
			...prev,
			[groupKey]: !prev[groupKey],
		}));
	};

	// Функция для открытия модального окна
	const openModal = () => {
		setIsModalOpen(true);
		setConfirmationInput(""); // Очищаем поле ввода
	};

	// Функция для закрытия модального окна
	const closeModal = () => {
		setIsModalOpen(false);
	};

	// Функция для проверки ввода и удаления расписания
	const handleDeleteSchedule = () => {
		// Проверяем, соответствует ли ввод шаблону "НазваниеРасписания/ИмяПользователя"
		const expectedInput = `${scheduleId?.title}/${profile?.username}`;
		if (confirmationInput.trim() === expectedInput) {
			mutate(); // Удаляем расписание
			closeModal(); // Закрываем модальное окно
		} else {
			toast.error(
				"Неверный ввод. Пожалуйста, введите название расписания и ваше имя."
			);
		}
	};

	// Фильтрация групп по поисковому запросу
	const filteredGroups = Object.entries(
		scheduleId?.schedule.groupTimetables || {}
	)
		.filter(([groupKey]) =>
			groupKey.toLowerCase().includes(searchQuery.trim().toLowerCase())
		)
		.map(([groupKey, timetables]) => ({ groupKey, timetables }));

	return (
		<div className='space-y-8'>
			{/* Заголовок и описание расписания */}
			<div className='bg-white p-6 rounded-lg shadow-md border border-gray-100 space-y-4'>
				<m.div
					variants={{
						hidden: { opacity: 0, y: 20 },
						visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
					}}
					initial='hidden'
					animate='visible'
					className='space-y-4'
				>
					<div className='flex justify-between'>
						<a
							href={`http://localhost:5555/api/schedule?api-key=${profile?.api_key}&schedule_id=${scheduleId?.id}`}
							target='_blank'
						>
							Открыть в формате JSON
						</a>
						<button type='button' className='text-red-500' onClick={openModal}>
							Удалить расписание
						</button>
					</div>

					{/* Заголовок */}
					<Title schedule={scheduleId!} profile={profile!} />

					{/* Описание */}
					<Description schedule={scheduleId!} profile={profile!} />

					{/* Кнопка "Вернуться" с иконкой */}
					<Link
						href={`${DASHBOARD_PAGES.SCHEDULE}`}
						className='flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors'
					>
						<ArrowLeft size={18} className='text-indigo-600' />
						Вернуться
					</Link>
				</m.div>
			</div>

			{/* Поле поиска */}
			<div className='mb-6'>
				<input
					type='text'
					placeholder='Поиск по названию группы...'
					value={searchQuery}
					onChange={e => setSearchQuery(e.target.value)}
					className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-gray-400'
				/>
			</div>

			{/* Расписание по дням */}
			<div className='space-y-6'>
				{filteredGroups.length > 0 ? (
					filteredGroups.map(({ groupKey, timetables }) => (
						<m.div
							key={groupKey}
							variants={{
								hidden: { opacity: 0, y: 20 },
								visible: {
									opacity: 1,
									y: 0,
									transition: { staggerChildren: 0.2 },
								},
							}}
							initial='hidden'
							animate='visible'
							className='space-y-4'
						>
							{/* Заголовок для группы с кнопкой сворачивания */}
							<m.div
								variants={{
									hidden: { opacity: 0, y: 20 },
									visible: {
										opacity: 1,
										y: 0,
										transition: { duration: 0.5 },
									},
								}}
								className='flex items-center justify-between gap-2 text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 cursor-pointer'
								onClick={() => toggleGroup(groupKey)}
							>
								<div className='flex items-center gap-2'>
									<Users size={20} className='text-gray-600' />
									<span>Расписание для группы: {groupKey}</span>
								</div>
								{expandedGroups[groupKey] ? (
									<ChevronUp size={20} className='text-gray-600' />
								) : (
									<ChevronDown size={20} className='text-gray-600' />
								)}
							</m.div>

							{/* Расписание для группы (условный рендеринг) */}
							{expandedGroups[groupKey] && (
								<m.div
									variants={{
										hidden: { opacity: 0, y: 20 },
										visible: {
											opacity: 1,
											y: 0,
											transition: { duration: 0.5 },
										},
									}}
									className='bg-white rounded-lg shadow-md p-4 border border-gray-200'
								>
									<div className='flex items-center gap-2 mb-3'>
										<CalendarCheck size={20} className='text-gray-600' />
										<h5 className='text-base font-medium text-gray-700'>
											Занятия группы
										</h5>
									</div>
									<ScheduleLesson groupSchedule={timetables} />
								</m.div>
							)}
						</m.div>
					))
				) : (
					<p className='text-center text-gray-600'>Группы не найдены.</p>
				)}
			</div>

			{/* Модальное окно подтверждения удаления */}
			{isModalOpen && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
					<div className='bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4'>
						<h2 className='text-xl font-semibold text-gray-800'>
							Подтвердите удаление
						</h2>
						<p className='text-gray-600'>
							Введите{" "}
							<strong>{`${scheduleId?.title}/${profile?.username}`}</strong>,
							чтобы подтвердить удаление:
						</p>
						<input
							type='text'
							value={confirmationInput}
							onChange={e => setConfirmationInput(e.target.value)}
							placeholder={`${scheduleId?.title}/${profile?.username}`}
							className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-gray-400'
						/>
						<div className='flex justify-end gap-4'>
							<button
								onClick={closeModal}
								className='px-4 py-2 text-sm font-medium rounded bg-gray-200 hover:bg-gray-300 transition-colors'
							>
								Отмена
							</button>
							<button
								onClick={handleDeleteSchedule}
								className='px-4 py-2 text-sm font-medium rounded bg-red-500 text-white hover:bg-red-600 transition-colors'
							>
								Удалить расписание
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
