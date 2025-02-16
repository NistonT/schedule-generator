"use client";
import { ButtonSubmit } from "@/components/ui/buttons/ButtonSubmit";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { Calendar } from "lucide-react";
import { useState } from "react";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Days } from "./components/Days";

dayjs.locale("ru");

export const Profile = () => {
	const [currentDate, setCurrentDate] = useState(dayjs());
	return (
		<>
			<div className='w-11/12 mx-auto'>
				<div className='flex items-center justify-between mb-8'>
					<h1 className='text-3xl font-bold text-indigo-600 flex items-center gap-1'>
						<Calendar width={30} height={30} /> <span>Генератор</span>
					</h1>
				</div>
				<Swiper spaceBetween={50} slidesPerView={1} initialSlide={0}>
					{[0, 1, 2, 3, 4, 5].map(offset => (
						<SwiperSlide key={offset}>
							{<Days date={currentDate.add(offset, "month")} />}
						</SwiperSlide>
					))}
				</Swiper>

				<span>
					<ButtonSubmit title={"Открыть панель"} />
				</span>
			</div>
		</>
	);
};
