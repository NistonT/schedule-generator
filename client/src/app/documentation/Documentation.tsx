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
				{/* Раздел Кабинеты */}
				<h2 className='text-xl font-semibold'>1. Кабинеты</h2>
				<p>
					<strong>Что это:</strong> Список доступных кабинетов для расписания.
				</p>
				<p>
					<strong>Как заполнять:</strong> Введите названия кабинетов через
					запятую или добавляйте по одному. Это будут все возможные кабинеты,
					которые можно использовать для занятий.
				</p>
				<p>
					<strong>Пример:</strong>{" "}
					<code>["228", "224", "231", "328", "324", "331"]</code>
				</p>

				{/* Раздел Группы */}
				<h2 className='text-xl font-semibold'>2. Группы</h2>
				<p>
					<strong>Что это:</strong> Список учебных групп, для которых нужно
					сгенерировать расписание.
				</p>
				<p>
					<strong>Как заполнять:</strong> Введите названия групп через запятую
					или добавляйте по одной. Каждая группа должна быть уникальной.
				</p>
				<p>
					<strong>Пример:</strong> <code>["Г1", "Г2", "Г3"]</code>
				</p>

				{/* Раздел Преподаватели */}
				<h2 className='text-xl font-semibold'>3. Преподаватели</h2>
				<p>
					<strong>Что это:</strong> Список преподавателей, участвующих в
					расписании.
				</p>
				<p>
					<strong>Как заполнять:</strong> Для каждого преподавателя укажите его
					ID (tid) и имя. ID должно быть уникальным числом.
				</p>
				<p>
					<strong>Пример:</strong>
					<pre className='bg-gray-100 p-4 rounded-md'>
						<code>
							{JSON.stringify(
								[
									{ tid: 1, name: "Шакурова" },
									{ tid: 2, name: "Сабирова" },
									{ tid: 3, name: "Рамазанова" },
								],
								null,
								2
							)}
						</code>
					</pre>
				</p>

				{/* Раздел subjectsMap */}
				<h2 className='text-xl font-semibold'>4. subjectsMap</h2>
				<p>
					<strong>Что это:</strong> Карта предметов для каждой группы. Здесь
					указываются все предметы, которые изучаются группами.
				</p>
				<p>
					<strong>Как заполнять:</strong> Для каждой группы укажите список
					предметов, которые она изучает. Предметы указываются как массив строк.
				</p>
				<p>
					<strong>Пример:</strong>
					<pre className='bg-gray-100 p-4 rounded-md'>
						<code>
							{JSON.stringify(
								{
									Г1: ["П-1", "П-3"],
									Г2: ["П-2", "П-4"],
								},
								null,
								2
							)}
						</code>
					</pre>
				</p>

				{/* Раздел teachersMap */}
				<h2 className='text-xl font-semibold'>5. teachersMap</h2>
				<p>
					<strong>Что это:</strong> Карта преподавателей для каждого предмета и
					группы. Здесь указывается, какой преподаватель ведет конкретный
					предмет для определенной группы.
				</p>
				<p>
					<strong>Как заполнять:</strong> Для каждого предмета укажите ID
					преподавателя (tid), название предмета (subject) и группу (group),
					которой он преподает.
				</p>
				<p>
					<strong>Пример:</strong>
					<pre className='bg-gray-100 p-4 rounded-md'>
						<code>
							{JSON.stringify(
								[
									{ tid: 1, subject: "П-1", group: "Г1" },
									{ tid: 2, subject: "П-3", group: "Г1" },
									{ tid: 3, subject: "П-2", group: "Г2" },
								],
								null,
								2
							)}
						</code>
					</pre>
				</p>

				{/* Раздел amountLimits */}
				<h2 className='text-xl font-semibold'>6. amountLimits</h2>
				<p>
					<strong>Что это:</strong> Ограничения на количество занятий для
					каждого предмета и типа урока (L, 1, 2). Здесь указывается, сколько
					раз должен быть дан предмет для конкретной группы и типа урока.
				</p>
				<p>
					<strong>Как заполнять:</strong> Для каждого предмета укажите группу
					(group), название предмета (subject), количество занятий (amount) и
					тип урока (lessonType). Тип урока может быть:
					<ul className='list-disc list-inside'>
						<li>"L" — лекция.</li>
						<li>"1" — подгруппа 1.</li>
						<li>"2" — подгруппа 2.</li>
					</ul>
				</p>
				<p>
					<strong>Пример:</strong>
					<pre className='bg-gray-100 p-4 rounded-md'>
						<code>
							{JSON.stringify(
								[
									{ group: "Г1", subject: "П-1", amount: 3, lessonType: "L" },
									{ group: "Г1", subject: "П-1", amount: 5, lessonType: "1" },
									{ group: "Г1", subject: "П-1", amount: 4, lessonType: "2" },
								],
								null,
								2
							)}
						</code>
					</pre>
				</p>

				{/* Раздел cabinetLimits */}
				<h2 className='text-xl font-semibold'>7. cabinetLimits</h2>
				<p>
					<strong>Что это:</strong> Ограничения на использование кабинетов для
					каждого преподавателя. Здесь указывается, какие кабинеты доступны для
					конкретного преподавателя.
				</p>
				<p>
					<strong>Как заполнять:</strong> Для каждого преподавателя укажите его
					ID (tid) и список доступных кабинетов (cabinets).
				</p>
				<p>
					<strong>Пример:</strong>
					<pre className='bg-gray-100 p-4 rounded-md'>
						<code>
							{JSON.stringify(
								[
									{ tid: 1, cabinets: ["228", "231"] },
									{ tid: 2, cabinets: ["224", "231"] },
									{ tid: 3, cabinets: ["328", "331"] },
								],
								null,
								2
							)}
						</code>
					</pre>
				</p>

				{/* Раздел days */}
				<h2 className='text-xl font-semibold'>8. days</h2>
				<p>
					<strong>Что это:</strong> Общее количество дней, на которые нужно
					сгенерировать расписание.
				</p>
				<p>
					<strong>Как заполнять:</strong> Укажите число — количество дней.
				</p>
				<p>
					<strong>Пример:</strong> <code>5</code>
				</p>

				{/* Раздел maxLoad */}
				<h2 className='text-xl font-semibold'>9. maxLoad</h2>
				<p>
					<strong>Что это:</strong> Максимальное количество пар (уроков) в день
					для каждой группы. Это ограничение на то, сколько пар может быть
					назначено за один день.
				</p>
				<p>
					<strong>Как заполнять:</strong> Укажите число — максимальное
					количество пар в день.
				</p>
				<p>
					<strong>Пример:</strong> <code>6</code>
				</p>

				{/* Раздел hours */}
				<h2 className='text-xl font-semibold'>10. hours</h2>
				<p>
					<strong>Что это:</strong> Ограничения на количество часов для каждой
					группы. Здесь можно указать, сколько часов должно быть выделено для
					каждой группы в течение недели.
				</p>
				<p>
					<strong>Как заполнять:</strong> Для каждой группы укажите массив
					чисел, представляющий количество часов для каждого дня недели.
				</p>
				<p>
					<strong>Пример:</strong>
					<pre className='bg-gray-100 p-4 rounded-md'>
						<code>
							{JSON.stringify(
								{
									Г1: [4, 6],
									Г2: [5, 5],
								},
								null,
								2
							)}
						</code>
					</pre>
				</p>

				{/* Раздел Как работает система */}
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

				{/* Раздел Пример заполнения */}
				<h2 className='text-xl font-semibold'>Пример заполнения</h2>
				<p>
					Ниже представлен пример запроса для генерации расписания. Все поля
					должны быть заполнены согласно описанию выше.
				</p>
				<pre className='bg-gray-100 p-4 rounded-md'>
					<code>
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
									{ group: "Г1", subject: "П-1", amount: 3, lessonType: "L" },
									{ group: "Г1", subject: "П-1", amount: 5, lessonType: "1" },
									{ group: "Г1", subject: "П-1", amount: 4, lessonType: "2" },
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
			</div>
		</div>
	);
};
