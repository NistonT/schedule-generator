"use client";
import { useProfile } from "@/hook/useProfile";
import { scheduleService } from "@/services/schedule.service";
import { useQuery } from "@tanstack/react-query";
import { m } from "motion/react";
import { useEffect } from "react";

export const Generation = () => {
	const { data } = useProfile();

	const {
		data: dataQuery,
		isLoading,
		isSuccess,
		isError,
	} = useQuery({
		queryKey: ["generation"],
		queryFn: () => scheduleService.getSchedule(data!.api_key),
		select: data => data.data,
	});

	useEffect(() => {
		if (isSuccess) {
			console.log(isSuccess, isLoading, dataQuery);
		}
		if (isError) {
			console.log(isSuccess, isLoading, dataQuery);
		}
	}, [dataQuery]);

	return (
		<>
			<div className='space-y-6'>
				<div className='bg-white shadow-md rounded-lg p-6'>
					<h2 className='text-xl font-semibold text-gray-800 mb-4'>Кабинеты</h2>
					{!isLoading ? (
						<div className='flex'>
							{dataQuery?.cabinets.map((cabinet, index) => (
								<div
									key={index}
									className='px-4 py-2 bg-gray-100 rounded-md text-gray-700'
								>
									{cabinet}
								</div>
							))}
						</div>
					) : (
						<div className='flex'>
							<m.div
								className='px-4 py-2 h-8 w-full bg-gray-100 rounded-md overflow-hidden relative shadow-sm'
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
							>
								<m.div
									initial={{ x: -150 }}
									animate={{ x: 1500 }}
									transition={{
										duration: 1,
										repeat: Infinity,
										repeatType: "loop",
										ease: "linear",
									}}
									className='w-32 h-full absolute top-0 left-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent'
								/>
							</m.div>
						</div>
					)}
				</div>

				<div className='bg-white shadow-md rounded-lg p-6'>
					<h2 className='text-xl font-semibold text-gray-800 mb-4'>Группы</h2>
					{!isLoading ? (
						<div className='flex'>
							{dataQuery?.groups.map((group, index) => (
								<div
									key={index}
									className='px-4 py-2 bg-gray-100 rounded-md text-gray-700'
								>
									{group}
								</div>
							))}
						</div>
					) : (
						<div className='flex justify-center items-center h-20'>
							<span className='text-gray-500'>Loading...</span>
						</div>
					)}
				</div>

				<div className='bg-white shadow-md rounded-lg p-6'>
					<h2 className='text-xl font-semibold text-gray-800 mb-4'>
						Преподаватели
					</h2>
					{!isLoading ? (
						<div className='flex'>
							{dataQuery?.teachers.map((teacher, index) => (
								<div
									key={index}
									className='px-4 py-2 bg-gray-100 rounded-md text-gray-700'
								>
									{teacher.name}
								</div>
							))}
						</div>
					) : (
						<div className='flex justify-center items-center h-20'>
							<span className='text-gray-500'>Loading...</span>
						</div>
					)}
				</div>
			</div>
		</>
	);
};
