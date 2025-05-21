"use client";
import { IGroupedDays, ISchedule } from "@/types/schedule.type";
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
	const [isModalUniqueCabinets, setIsModalUniqueCabinets] =
		useState<boolean>(false);
	const handleIsModalUniqueCabinets = () => {
		setIsModalUniqueCabinets(!isModalUniqueCabinets);
	};

	// Сделать генератор, который будет генерировать расписание по есть в одну пары несколько групп можно ввести

	return (
		<>
			{/* Статистика */}
			<div className='my-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5'>
				<div className='border p-3 rounded-md'>
					<strong>Дата создания:</strong>{" "}
					{new Date(schedule.CreatedAt).toLocaleDateString()}
				</div>
				<div className='border p-3 rounded-md'>
					<strong>Дата обновления:</strong>{" "}
					{new Date(schedule.UpdatedAt).toLocaleDateString()}
				</div>
				<div className='border p-3 rounded-md'>
					<strong>ID:</strong> {schedule.id}
				</div>
				<div className='border p-3 rounded-md'>
					<strong>Статус:</strong> {schedule.isShow ? "Отображается" : "Скрыто"}
				</div>
				<div className='border p-3 rounded-md'>
					<strong>Всего пар:</strong> {totalLessons}
				</div>
				<div className='border p-3 rounded-md'>
					<strong>Всего дней:</strong> {groupedDays.length}
				</div>
				<div className='border p-3 rounded-md'>
					<strong>Предметов:</strong> {uniqueSubjects.length}
				</div>
				<div className='border p-3 rounded-md'>
					<strong>Групп:</strong> {uniqueGroups.length}
				</div>
				{isModalUniqueCabinets ? (
					<div
						className='border p-3 rounded-md'
						onClick={handleIsModalUniqueCabinets}
					>
						{uniqueCabinets.map(cabinets => (
							<div>{cabinets}</div>
						))}
					</div>
				) : (
					<div
						className='border p-3 rounded-md'
						onClick={handleIsModalUniqueCabinets}
					>
						<strong>Кабинетов:</strong> {uniqueCabinets.length}
					</div>
				)}
			</div>
		</>
	);
};
