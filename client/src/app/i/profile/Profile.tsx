"use client"; // Указываем, что это клиентский компонент
import dayjs from "dayjs";
import "dayjs/locale/ru"; // Локализация для русского языка
import { useState } from "react";
import "swiper/css";
import { Mousewheel } from "swiper/modules"; // Добавляем поддержку свайпа мышкой
import { Swiper, SwiperSlide } from "swiper/react";

dayjs.locale("ru"); // Устанавливаем локаль

export const Profile = () => {
	const [currentDate, setCurrentDate] = useState(dayjs()); // Текущая дата
	const [slides, setSlides] = useState([-1, 0, 1]); // Слайды для предыдущего, текущего и следующего месяцев

	// Генерация массива дат для текущего месяца
	const generateMonthDays = (date: dayjs.Dayjs) => {
		return Array.from({ length: date.daysInMonth() }, (_, i) => i + 1);
	};

	// Обработчик изменения слайда
	const handleSlideChange = (swiper: any) => {
		const newDate = currentDate.add(swiper.activeIndex - 1, "month");
		setCurrentDate(newDate);

		// Обновляем слайды при достижении границы
		if (swiper.activeIndex === 0) {
			// Свайп влево (переход к предыдущему месяцу)
			setSlides([-2, -1, 0]);
			swiper.slideTo(1, 0); // Перемещаемся к центральному слайду
		} else if (swiper.activeIndex === 2) {
			// Свайп вправо (переход к следующему месяцу)
			setSlides([0, 1, 2]);
			swiper.slideTo(1, 0); // Перемещаемся к центральному слайду
		}
	};

	return (
		<div className='p-6'>
			<Swiper
				modules={[Mousewheel]} // Добавляем поддержку свайпа мышкой
				mousewheel={true} // Включаем свайп мышкой
				onSlideChange={handleSlideChange} // Обработчик изменения слайда
				initialSlide={1} // Начинаем с текущего месяца
			>
				{/* Слайды для предыдущего, текущего и следующего месяцев */}
				{slides.map(offset => {
					const monthDate = currentDate.add(offset, "month");
					const daysInMonth = generateMonthDays(monthDate);

					return (
						<SwiperSlide key={offset}>
							<div className='text-center'>
								<h2 className='text-2xl font-bold mb-4'>
									{monthDate.format("MMMM YYYY")}
								</h2>
								<div className='grid grid-cols-7 gap-2'>
									{daysInMonth.map(day => (
										<div
											key={day}
											className='p-4 border rounded-lg text-center cursor-pointer hover:bg-gray-100'
										>
											{day}
										</div>
									))}
								</div>
							</div>
						</SwiperSlide>
					);
				})}
			</Swiper>
		</div>
	);
};
