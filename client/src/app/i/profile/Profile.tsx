"use client";

import { useProfile } from "@/hook/useProfile";
import { dataProfileAtom } from "@/jotai/generation";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { useSetAtom } from "jotai";
import Cookies from "js-cookie";
import { Calendar } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Days } from "./components/Days";

import { DaysList } from "@/components/Generation/DaysList";
import { CreateSchedule } from "./components/CreateSchedule";
import { GenerationSchedule } from "./components/GenerationSchedule";
import { Panel } from "./components/Panel";

dayjs.locale("ru");

export const Profile = () => {
	const [yearOffset, setYearOffset] = useState(0);
	const currentDateRef = useRef(dayjs());

	const { data } = useProfile();
	const setDataProfile = useSetAtom(dataProfileAtom);

	useEffect(() => {
		if (!data) {
			Cookies.remove("refreshToken");
			return;
		}

		setDataProfile(data);
	}, [data]);

	// Генерация 12 месяцев вперёд от текущего (включая текущий)
	const generateMonths = () => {
		const result: dayjs.Dayjs[] = [];
		const current = currentDateRef.current.add(yearOffset, "year");

		for (let i = 0; i < 12; i++) {
			result.push(current.clone().add(i, "month"));
		}

		return result;
	};

	// Обработчики для навигации
	const handlePrevYear = () => setYearOffset(prev => prev - 1);
	const handleNextYear = () => setYearOffset(prev => prev + 1);

	return (
		<>
			<div className='w-11/12 mx-auto'>
				<div className='flex items-center justify-between mb-8'>
					<h1 className='text-3xl font-bold text-gray-950 flex items-center gap-1'>
						<Calendar width={30} height={30} /> <span>Генератор</span>
					</h1>
				</div>

				<Panel />

				{/* Кнопки навигации по годам */}
				<div className='flex justify-between items-center my-4'>
					<button
						onClick={handlePrevYear}
						className='px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition'
					>
						← Предыдущий год
					</button>
					<h2 className='text-xl font-semibold'>
						{currentDateRef.current.add(yearOffset, "year").format("YYYY")}
					</h2>
					<button
						onClick={handleNextYear}
						className='px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition'
					>
						Следующий год →
					</button>
				</div>

				{/* Свайпер с месяцами */}
				<Swiper
					modules={[Navigation]}
					spaceBetween={50}
					slidesPerView={1}
					initialSlide={0}
					navigation
					className='mb-8'
				>
					{generateMonths().map((monthDate, index) => (
						<SwiperSlide key={`month-${index}`}>
							<Days date={monthDate} />
						</SwiperSlide>
					))}
				</Swiper>

				{/* Дополнительные кнопки управления */}
				<div className='flex justify-end gap-2 mt-4'>
					<a
						href={`http://localhost:5555/api/schedule/generate?api-key=${data?.api_key}`}
						target='_blank'
						rel='noopener noreferrer'
						className='px-4 py-2 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50 transition'
					>
						Перейти к расписанию
					</a>
					<GenerationSchedule />
					<CreateSchedule />
				</div>

				{/* Список выбранных дней */}
				<div className='mt-10'>
					<DaysList />
				</div>
			</div>
		</>
	);
};
