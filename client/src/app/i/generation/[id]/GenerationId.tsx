"use client";
import { useGetSchedule } from "@/hook/useGetSchedule";
import { useProfile } from "@/hook/useProfile";
import { Loader2 } from "lucide-react";
import { m } from "motion/react";
import { useState } from "react";
import { CabinetsGeneration } from "./components/CabinetsGeneration";
import { GroupGeneration } from "./components/GroupsGeneration";
import { TeacherGeneration } from "./components/TeacherGeneration";

type Props = {
	id: string;
};

export const GenerationId = ({ id }: Props) => {
	const [activeTab, setActiveTab] = useState<
		"cabinets" | "groups" | "teachers"
	>("cabinets");
	const { data: profile } = useProfile();
	const { schedule, isLoading, isError } = useGetSchedule(profile!, id);

	return (
		<div className='min-h-screen py-10 px-4'>
			<div className='max-w-5xl mx-auto space-y-8'>
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
						Выберите категорию ниже, чтобы добавлять элементы
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

				{!isLoading && !isError && schedule && (
					<>
						{/* Табы */}
						<div className='flex justify-center space-x-4 mb-6'>
							<button
								onClick={() => setActiveTab("cabinets")}
								className={`px-6 py-2 rounded-lg font-medium transition-all ${
									activeTab === "cabinets"
										? "bg-brand text-gray-950 shadow-md"
										: "bg-white text-gray-700 hover:bg-gray-100"
								}`}
							>
								Кабинеты
							</button>
							<button
								onClick={() => setActiveTab("groups")}
								className={`px-6 py-2 rounded-lg font-medium transition-all ${
									activeTab === "groups"
										? "bg-brand text-gray-950 shadow-md"
										: "bg-white text-gray-700 hover:bg-gray-100"
								}`}
							>
								Группы
							</button>
							<button
								onClick={() => setActiveTab("teachers")}
								className={`px-6 py-2 rounded-lg font-medium transition-all ${
									activeTab === "teachers"
										? "bg-brand text-gray-950 shadow-md"
										: "bg-white text-gray-700 hover:bg-gray-100"
								}`}
							>
								Преподаватели
							</button>
						</div>

						{/* Контент в зависимости от активного таба */}
						<m.div
							key={activeTab}
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
							transition={{ type: "spring", stiffness: 300, damping: 20 }}
						>
							{activeTab === "cabinets" && (
								<CabinetsGeneration
									profile={profile}
									id={id}
									schedule={schedule}
								/>
							)}
							{activeTab === "groups" && (
								<GroupGeneration
									profile={profile}
									id={id}
									schedule={schedule}
								/>
							)}
							{activeTab === "teachers" && (
								<TeacherGeneration
									profile={profile}
									id={id}
									schedule={schedule}
								/>
							)}
						</m.div>
					</>
				)}
			</div>
		</div>
	);
};
