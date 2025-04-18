"use client";
import { ButtonSubmit } from "@/components/ui/buttons/ButtonSubmit";
import { monthGeneration } from "@/constants/month.generate.constants";
import { useProfile } from "@/hook/useProfile";
import { dataProfileAtom } from "@/jotai/generation";
import { modalAtom } from "@/jotai/modal";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import { useAtom, useSetAtom } from "jotai";
import Cookies from "js-cookie";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Days } from "./components/Days";
import { Modal } from "./components/Modal";

dayjs.locale("ru");

export const Profile = () => {
	const [currentDate, setCurrentDate] = useState(dayjs());
	const [isModal, setIsModal] = useAtom<boolean>(modalAtom);
	const { data } = useProfile();
	const setDataProfile = useSetAtom(dataProfileAtom);

	const handlerIsModal = () => {
		setIsModal(!isModal);
	};

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
					<h1 className='text-3xl font-bold text-indigo-600 flex items-center gap-1'>
						<Calendar width={30} height={30} /> <span>Генератор</span>
					</h1>
				</div>
				<Swiper spaceBetween={50} slidesPerView={1} initialSlide={0}>
					{monthGeneration.map(offset => (
						<SwiperSlide key={offset}>
							{<Days date={currentDate.add(offset, "month")} />}
						</SwiperSlide>
					))}
				</Swiper>

				<span onClick={handlerIsModal}>
					<ButtonSubmit title={"Открыть панель"} />
				</span>

				{isModal && <Modal />}
			</div>
		</>
	);
};
