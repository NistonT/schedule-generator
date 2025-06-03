"use client";
import { useGetSchedule } from "@/hook/useGetSchedule";
import { useProfile } from "@/hook/useProfile";
import { CabinetsGeneration } from "./components/CabinetsGeneration";

type Props = {
	id: string;
};

export const GenerationId = ({ id }: Props) => {
	const { data: profile } = useProfile();
	const { schedule, isLoading, isError } = useGetSchedule(profile!, id);

	return (
		<>
			{isLoading ? (
				"Загрузка..."
			) : isError ? (
				"Ошибка при загрузке данных"
			) : !schedule ? (
				"Расписание не найдено"
			) : (
				<div className='min-h-screen p-6'>
					<CabinetsGeneration profile={profile} id={id} schedule={schedule} />
				</div>
			)}
		</>
	);
};
