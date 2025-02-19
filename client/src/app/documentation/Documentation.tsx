"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const Documentation = () => {
	const { back } = useRouter();

	return (
		<div className='p-6'>
			<Link
				href={"#"}
				onClick={() => back()}
				className='mt-6 inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700'
			>
				Вернуться...
			</Link>
			<h1 className='text-2xl font-bold mb-4'>Документация</h1>
			<div className='space-y-4'>
				<h2 className='text-xl font-semibold'>1. Кабинеты</h2>
				<p>
					<strong>Что это:</strong> Список доступных кабинетов.
				</p>
				<p>
					<strong>Как заполнять:</strong> Введите названия кабинетов через
					запятую или добавляйте по одному.
				</p>
				<p>
					<strong>Пример:</strong> <code>228, 224, 231</code>
				</p>

				<h2 className='text-xl font-semibold'>2. Группы</h2>
				<p>
					<strong>Что это:</strong> Список учебных групп.
				</p>
				<p>
					<strong>Как заполнять:</strong> Введите названия групп через запятую
					или добавляйте по одной.
				</p>
				<p>
					<strong>Пример:</strong> <code>Г1, Г2, Г3</code>
				</p>

				{/* Добавьте остальные разделы документации аналогично */}

				<h2 className='text-xl font-semibold'>Как работает система</h2>
				<p>
					1. Заполните все поля в соответствии с инструкциями выше.
					<br />
					2. Нажмите кнопку <strong>"Отправить"</strong>.
					<br />
					3. Система сгенерирует расписание на основе введенных данных.
					<br />
					4. Если данные заполнены корректно, вы увидите сообщение{" "}
					<strong>"Расписание сгенерировано"</strong>.
				</p>

				<h2 className='text-xl font-semibold'>Пример заполнения</h2>
				<pre className='bg-gray-100 p-4 rounded-md'>
					<code>
						{JSON.stringify(
							{
								cabinets: ["228", "224", "231"],
								groups: ["Г1", "Г2"],
								teachers: [
									{ tid: 1, name: "Шакурова" },
									{ tid: 2, name: "Сабирова" },
								],
								subjectsMap: {
									Г1: ["П-1", "П-3"],
									Г2: ["П-2", "П-4"],
								},
								teachersMap: [
									{ tid: 1, subject: "П-1", group: "Г1" },
									{ tid: 2, subject: "П-3", group: "Г1" },
								],
								amountLimits: [
									{ group: "Г1", subject: "П-1", amount: 3, lessonType: "L" },
									{ group: "Г1", subject: "П-1", amount: 5, lessonType: "1" },
								],
								cabinetLimits: [
									{ tid: 1, cabinets: ["228", "231"] },
									{ tid: 2, cabinets: ["224", "231"] },
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
			</div>
		</div>
	);
};
