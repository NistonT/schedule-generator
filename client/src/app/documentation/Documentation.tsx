"use client";
import { ArrowLeft, BookOpen, CalendarDays, Clock, MapPin } from "lucide-react";
import { m } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const Documentation = () => {
	const { back } = useRouter();

	return (
		<>
			<m.div
				variants={{
					hidden: { opacity: 0, y: 20 },
					visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
				}}
				initial='hidden'
				animate='visible'
				className='min-h-screen bg-gray-50 p-6 relative overflow-hidden pt-28'
			>
				{/* Кнопка "Вернуться" */}
				<Link
					href='#'
					onClick={() => back()}
					className='flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors mb-6'
				>
					<ArrowLeft size={20} />
					<span>Вернуться...</span>
				</Link>

				{/* Заголовок */}
				<m.h1
					variants={{
						hidden: { opacity: 0, y: 20 },
						visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
					}}
					className='text-3xl font-bold text-indigo-600 flex items-center gap-2 mb-8'
				>
					<BookOpen size={24} />
					<span>Документация</span>
				</m.h1>

				{/* Основной контент */}
				<div className='space-y-8'>
					{/* Разделы документации */}
					{[...Array(10)].map((_, index) => (
						<m.div
							key={index}
							variants={{
								hidden: { opacity: 0, y: 20 },
								visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
							}}
						>
							<h2 className='text-xl font-semibold flex items-center gap-2 mb-4'>
								<MapPin size={20} className='text-indigo-600' />
								<span>{`Раздел ${index + 1}`}</span>
							</h2>
							<p className='text-gray-700'>
								Это описание раздела. Здесь вы можете найти информацию о том,
								как заполнять данные для генерации расписания.
							</p>
							<p className='mt-2'>
								<strong>Пример:</strong>{" "}
								<code className='bg-gray-100 p-2 rounded-md'>
									{`["Пример данных"]`}
								</code>
							</p>
						</m.div>
					))}

					{/* Как работает система */}
					<m.div
						variants={{
							hidden: { opacity: 0, y: 20 },
							visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
						}}
					>
						<h2 className='text-xl font-semibold flex items-center gap-2 mb-4'>
							<CalendarDays size={20} className='text-indigo-600' />
							<span>Как работает система</span>
						</h2>
						<p className='text-gray-700'>
							1. Заполните все поля в соответствии с инструкциями выше.
							<br />
							2. Нажмите кнопку <strong>"Отправить"</strong>.
							<br />
							3. Система сгенерирует расписание на основе введенных данных.
						</p>
					</m.div>

					{/* Пример заполнения */}
					<m.div
						variants={{
							hidden: { opacity: 0, y: 20 },
							visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
						}}
					>
						<h2 className='text-xl font-semibold flex items-center gap-2 mb-4'>
							<Clock size={20} className='text-indigo-600' />
							<span>Пример заполнения</span>
						</h2>
						<pre className='bg-gray-100 p-4 rounded-md overflow-auto'>
							<code className='text-sm'>
								{JSON.stringify(
									{
										cabinets: ["228", "224", "231", "328", "324", "331"],
										groups: ["Г1", "Г2"],
										teachers: [
											{ tid: 1, name: "Шакурова" },
											{ tid: 2, name: "Сабирова" },
											{ tid: 3, name: "Рамазанова" },
										],
										subjectsMap: {
											Г1: ["П-1", "П-3"],
											Г2: ["П-2", "П-4"],
										},
										teachersMap: [
											{ tid: 1, subject: "П-1", group: "Г1" },
											{ tid: 2, subject: "П-3", group: "Г1" },
											{ tid: 3, subject: "П-2", group: "Г2" },
										],
										amountLimits: [
											{
												group: "Г1",
												subject: "П-1",
												amount: 3,
												lessonType: "L",
											},
											{
												group: "Г1",
												subject: "П-1",
												amount: 5,
												lessonType: "1",
											},
											{
												group: "Г1",
												subject: "П-1",
												amount: 4,
												lessonType: "2",
											},
										],
										cabinetLimits: [
											{ tid: 1, cabinets: ["228", "231"] },
											{ tid: 2, cabinets: ["224", "231"] },
											{ tid: 3, cabinets: ["328", "331"] },
										],
										days: 5,
										maxLoad: 6,
										hours: {
											Г1: [4, 6],
											Г2: [5, 5],
										},
									},
									null,
									2
								)}
							</code>
						</pre>
					</m.div>
				</div>
			</m.div>
		</>
	);
};
