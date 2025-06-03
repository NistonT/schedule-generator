"use client";
import { useGetSchedule } from "@/hook/useGetSchedule";
import { useProfile } from "@/hook/useProfile";
import { Loader2 } from "lucide-react";
import { m } from "motion/react";
import { CabinetsGeneration } from "./components/CabinetsGeneration";
import { GroupGeneration } from "./components/GroupsGeneration";

type Props = {
	id: string;
};

export const GenerationId = ({ id }: Props) => {
	const { data: profile } = useProfile();
	const { schedule, isLoading, isError } = useGetSchedule(profile!, id);

	return (
		<div className='min-h-screen py-10 px-4'>
			<div className='max-w-5xl mx-auto w-full space-y-8'>
				{/* Заголовок */}
				<m.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
					className='text-center mb-6'
				>
					<h1 className='text-3xl font-bold text-gray-900'>
						Управление расписанием
					</h1>
					<p className='text-gray-500 mt-2'>
						Добавляйте кабинеты и группы для текущего расписания
					</p>
				</m.div>

				{/* Статус загрузки */}
				{isLoading && (
					<m.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className='flex justify-center items-center gap-2 text-gray-600'
					>
						<Loader2 className='animate-spin h-6 w-6' />
						<span>Загрузка данных...</span>
					</m.div>
				)}

				{/* Ошибка */}
				{isError && (
					<m.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className='text-center text-red-500 p-4 rounded-lg bg-red-50 border border-red-100'
					>
						Ошибка загрузки данных. Попробуйте позже.
					</m.div>
				)}

				{/* Контент: кабинеты и группы один под другим */}
				{!isLoading && !isError && schedule ? (
					<>
						<div className='flex'>
							{/* Кабинеты */}
							<m.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2 }}
								className='w-full'
							>
								<CabinetsGeneration
									profile={profile}
									id={id}
									schedule={schedule}
								/>
							</m.div>

							{/* Группы */}
							<m.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3 }}
								className='w-full'
							>
								<GroupGeneration
									profile={profile}
									id={id}
									schedule={schedule}
								/>
							</m.div>
						</div>
					</>
				) : null}
			</div>
		</div>
	);
};
