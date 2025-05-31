"use client";
import { useAddCabinet } from "@/hook/useAddCabinet";
import { useGetSchedule } from "@/hook/useGetSchedule";
import { useProfile } from "@/hook/useProfile";
import { useGetCabinet } from "../../../../hook/useGetCabinet";

type Props = {
	id: string;
};

export const GenerationId = ({ id }: Props) => {
	const { data: profile } = useProfile();

	const {
		schedule,
		isLoading: isScheduleLoading,
		isError: isScheduleError,
	} = useGetSchedule(profile!, id);
	const {
		cabinetsGet,
		isLoading: isCabinetsLoading,
		isError: isCabinetsError,
	} = useGetCabinet(id, profile!.api_key);
	const { onSubmit, register, handleSubmit } = useAddCabinet(profile!, id);

	// Объединяем состояния загрузки и ошибок
	const isLoading = isScheduleLoading || isCabinetsLoading;
	const isError = isScheduleError || isCabinetsError;

	return (
		<>
			{isLoading ? (
				"Загрузка..."
			) : isError ? (
				"Ошибка при загрузке данных"
			) : !schedule ? (
				"Расписание не найдено"
			) : (
				<div className='min-h-screen bg-gray-50 p-6'>
					<div className='max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6'>
						<h1 className='text-2xl font-bold text-gray-800 mb-6'>
							Добавить кабинет
						</h1>

						<div className='mb-8'>
							<form onSubmit={handleSubmit(onSubmit)} className='flex gap-3'>
								<input
									{...register("name", { required: true })}
									type='text'
									placeholder='Введите название кабинета'
									className='flex-1 px-4 py-2 border border-gray-300 rounded-lg'
								/>
								<button
									type='submit'
									className='px-6 py-2 bg-gray-950 text-white font-medium rounded-lg'
								>
									Добавить
								</button>
							</form>
						</div>

						<div>
							<h2 className='text-xl font-semibold text-gray-700 mb-4'>
								Список кабинетов
							</h2>
							<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3'>
								{cabinetsGet?.cabinets?.length ? (
									cabinetsGet.cabinets.map((cabinet, index) => (
										<div
											key={index}
											className='bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-lg border border-gray-200 transition cursor-pointer'
										>
											<span className='text-gray-800'>{cabinet}</span>
										</div>
									))
								) : (
									<p className='text-gray-500'>Кабинеты не найдены</p>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
