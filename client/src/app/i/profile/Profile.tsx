"use client";
import { DaysList } from "@/components/Generation/DaysList";
import { monthGeneration } from "@/constants/month.generate.constants";
import { useProfile } from "@/hook/useProfile";
import { dataProfileAtom } from "@/jotai/generation";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { useSetAtom } from "jotai";
import Cookies from "js-cookie";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { CreateSchedule } from "./components/CreateSchedule";
import { Days } from "./components/Days";
import { GenerationSchedule } from "./components/GenerationSchedule";
import { Panel } from "./components/Panel";

dayjs.locale("ru");

export const Profile = () => {
	const [currentDate, setCurrentDate] = useState(dayjs());
	const { data } = useProfile();
	const setDataProfile = useSetAtom(dataProfileAtom);

	useEffect(() => {
		if (!data) {
			Cookies.remove("refreshToken");
			return;
		}

		setDataProfile(data);
	}, [data]);

	return (
		<>
			<div className='w-11/12 mx-auto'>
				<div className='flex items-center justify-between mb-8'>
					<h1 className='text-3xl font-bold text-gray-950 flex items-center gap-1'>
						<Calendar width={30} height={30} /> <span>Генератор</span>
					</h1>
				</div>
				<Panel />
				<Swiper spaceBetween={50} slidesPerView={1} initialSlide={0}>
					{monthGeneration.map(offset => (
						<SwiperSlide key={offset}>
							{<Days date={currentDate.add(offset, "month")} />}
						</SwiperSlide>
					))}
				</Swiper>
				<div className='flex justify-end gap-2 mt-4'>
					<a
						href={`http://localhost:5555/api/schedule/generate?api-key=${data?.api_key}`}
						target='_blank'
					>
						Перейти к расписанию
					</a>

					<GenerationSchedule />
					<CreateSchedule />
				</div>
				<div className='mt-10'>
					<DaysList />
				</div>
			</div>
		</>
	);
};
