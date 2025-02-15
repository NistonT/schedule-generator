"use client";
import { Loading } from "@/components/Loading";
import { ButtonLink } from "@/components/ui/buttons/ButtonLink";
import { userService } from "@/services/user.service";
import { GitHubUser } from "@/types/git.types";
import { useQuery } from "@tanstack/react-query";
import { BookText, Code, Info, LinkIcon, MapPin } from "lucide-react";
import Image from "next/image";

export const About = () => {
	const { data, isLoading } = useQuery<GitHubUser | null>({
		queryKey: ["github"],
		queryFn: () => userService.gitHub(),
	});

	if (!data) {
		return <div>Данные не найдены</div>;
	}

	return (
		<>
			{isLoading ? (
				<Loading />
			) : (
				<div>
					<div>
						<div>
							<h1 className='text-3xl font-bold text-indigo-600 flex items-center gap-2'>
								<Info /> <span>О сайте</span>
							</h1>
						</div>

						<div className='p-6'>
							<h2 className='text-3xl font-bold text-indigo-600 flex items-center gap-2 px-4 py-8'>
								<BookText />
								<span>Описание</span>
							</h2>
							<div>
								<p className='text-gray-700 text-lg leading-relaxed'>
									Сайт представляет собой удобный инструмент для генерации
									учебного расписания. Перед использованием необходимо
									зарегистрироваться и войти в свой аккаунт. После авторизации в
									профиле пользователя становится доступна форма для генерации
									расписания. Генерация расписания происходит автоматически на
									основе введенных параметров (например, количество предметов,
									преподавателей, временные интервалы). После создания
									расписания пользователь может вносить изменения, чтобы
									адаптировать его под свои потребности. Все расписания доступны
									через API, и для получения конкретного расписания необходимо
									ввести уникальный ключ.
								</p>
								<p className='mt-4 text-red-600 font-semibold uppercase'>
									ВАЖНО: САЙТ ТОЛЬКО ГЕНЕРИРУЕТ РАСПИСАНИЕ. ИЗМЕНЕНИЯ ВНОСЯТСЯ
									ОТДЕЛЬНО ОТ ЭТОГО САЙТА.
								</p>
							</div>
						</div>

						<div className='p-6'>
							<h2 className='text-3xl font-bold text-indigo-600 flex items-center gap-2 px-4 py-8'>
								<Code />
								<span>Разработчик</span>
							</h2>
							<div className='flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6'>
								<Image
									src={data.avatar_url}
									alt={data.login}
									className='rounded-full border-4 border-gray-200'
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
												<MapPin className='w-5 h-5 mr-2' />
												<span>{data.location}</span>
											</div>
										)}
										{data.blog && (
											<div className='flex items-center text-gray-600'>
												<LinkIcon className='w-5 h-5 mr-2' />
												<a
													href={data.blog}
													target='_blank'
													rel='noopener noreferrer'
													className='hover:text-indigo-600'
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
								<p className='mt-4'>
									Данные пользователя получены через GitHub API.
								</p>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
