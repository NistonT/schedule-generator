"use client";
import { Loading } from "@/components/Loading";
import { ButtonLink } from "@/components/ui/buttons/ButtonLink";
import { userService } from "@/services/user.service";
import { IGitHubUser } from "@/types/git.type";
import { useQuery } from "@tanstack/react-query";
import { BookText, Code, Info, LinkIcon, MapPin } from "lucide-react";
import { m } from "motion/react";
import Image from "next/image";

export const About = () => {
	const { data, isLoading } = useQuery<IGitHubUser | null>({
		queryKey: ["github"],
		queryFn: async () => {
			const response = await userService.gitHub();
			return response.data;
		},
	});

	if (!data) {
		return <div>Данные не найдены</div>;
	}

	return (
		<>
			{isLoading ? (
				<Loading />
			) : (
				<m.div className='min-h-screen relative overflow-hidden'>
					{/* Анимация частиц */}
					<div className='absolute inset-0 z-0'>
						{[...Array(30)].map((_, index) => (
							<m.div
								key={index}
								variants={{
									initial: {
										scale: 1,
										opacity: 1,
										x: 0,
										y: 0,
									},
									exit: {
										scale: 0,
										opacity: 0,
										x: Math.random() * 200 - 100, // Случайное смещение по X
										y: Math.random() * 200 - 100, // Случайное смещение по Y
										transition: {
											duration: 1.5,
											ease: "easeInOut",
										},
									},
								}}
								initial='initial'
								animate='exit'
								transition={{
									repeat: Infinity,
									repeatType: "reverse",
									duration: 1.5,
									delay: Math.random() * 2, // Разная задержка для каждой частицы
								}}
								className='absolute w-4 h-4 rounded-full bg-gray-950 shadow-md'
								style={{
									top: `${Math.random() * 100}%`,
									left: `${Math.random() * 100}%`,
								}}
							/>
						))}
					</div>

					{/* Полупрозрачный фон */}
					<div className='absolute inset-0 z-10 bg-gray-50 bg-opacity-80' />

					<div className='relative z-20 p-6'>
						{/* Заголовок "О сайте" */}
						<m.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.2 }}
							className='mb-8'
						>
							<h1 className='text-3xl font-bold text-gray-950 flex items-center gap-2'>
								<Info size={24} /> <span>О сайте</span>
							</h1>
						</m.div>

						{/* Описание */}
						<m.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.4 }}
							className='bg-white rounded-lg shadow-lg p-6 mb-8'
						>
							<h2 className='text-3xl font-bold text-gray-950 flex items-center gap-2 mb-4'>
								<BookText size={24} /> <span>Описание</span>
							</h2>
							<p className='text-gray-700 text-lg leading-relaxed'>
								Сайт представляет собой удобный инструмент для генерации
								учебного расписания. Перед использованием необходимо
								зарегистрироваться и войти в свой аккаунт. После авторизации в
								профиле пользователя становится доступна форма для генерации
								расписания. Генерация расписания происходит автоматически на
								основе введенных параметров (например, количество предметов,
								преподавателей, временные интервалы). После создания расписания
								пользователь может вносить изменения, чтобы адаптировать его под
								свои потребности. Все расписания доступны через API, и для
								получения конкретного расписания необходимо ввести уникальный
								ключ.
							</p>
							<p className='mt-4 text-red-600 font-semibold uppercase'>
								ВАЖНО: САЙТ ТОЛЬКО ГЕНЕРИРУЕТ РАСПИСАНИЕ. ИЗМЕНЕНИЯ ВНОСЯТСЯ
								ОТДЕЛЬНО ОТ ЭТОГО САЙТА.
							</p>
						</m.div>

						{/* Разработчик */}
						<m.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.6 }}
							className='bg-white rounded-lg shadow-lg p-6 space-y-6'
						>
							<h2 className='text-3xl font-bold text-indigo-600 flex items-center gap-2'>
								<Code size={24} /> <span>Разработчик</span>
							</h2>
							<div className='flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6'>
								<Image
									src={data.avatar_url}
									alt={data.login}
									className='rounded-full border-4 border-gray-200 shadow-md'
									width={160}
									height={160}
								/>
								<div className='flex-1'>
									<h2 className='text-2xl font-bold text-gray-900'>
										{data.name}
									</h2>
									<p className='text-gray-600 mt-2'>{data.login}</p>
									<p className='text-gray-600 mt-2'>{data.bio}</p>

									<div className='mt-4 space-y-2'>
										{data.location && (
											<div className='flex items-center text-gray-600'>
												<MapPin size={20} className='mr-2' />
												<span>{data.location}</span>
											</div>
										)}
										{data.blog && (
											<div className='flex items-center text-gray-600'>
												<LinkIcon size={20} className='mr-2' />
												<a
													href={data.blog}
													target='_blank'
													rel='noopener noreferrer'
													className='hover:text-indigo-600 transition-colors'
												>
													{data.blog}
												</a>
											</div>
										)}
									</div>

									<div className='mt-6'>
										<ButtonLink
											href={data.html_url}
											title='Профиль на GitHub'
											target='_blank'
										/>
									</div>
								</div>
							</div>
							<div className='mt-10 text-gray-600'>
								<p>Сайт создан с использованием:</p>
								<ul className='list-disc list-inside mt-2'>
									<li>Frontend: Next.js, TypeScript, Tailwind CSS</li>
									<li>Backend: Nest.js, TypeScript, Prisma</li>
								</ul>
								<div className='mt-4'>Версия сайта: 0.1</div>
								<p className='mt-4'>
									Данные пользователя получены через GitHub API.
								</p>
							</div>
						</m.div>
					</div>
				</m.div>
			)}
		</>
	);
};
