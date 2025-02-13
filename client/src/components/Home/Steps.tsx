import { Footprints } from "lucide-react";

export const Steps = () => {
	return (
		<>
			<div className='container px-5 py-24 mx-auto flex flex-wrap'>
				<div className='flex flex-wrap w-full justify-center'>
					<div className='md:pr-10 md:py-6'>
						<div className='flex relative pb-12'>
							<div className='h-full w-10 absolute inset-0 flex items-center justify-center'>
								<div className='h-full w-1 bg-gray-200 pointer-events-none'></div>
							</div>
							<div className='flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10'>
								<Footprints />
							</div>
							<div className='flex-grow pl-4'>
								<h2 className='font-medium title-font text-sm text-gray-900 mb-1 tracking-wider'>
									ШАГ 1
								</h2>
								<p className='leading-relaxed'>
									Создайте страницу пользователя. Зарегистрируйтесь, чтобы
									получить доступ к функционалу генератора.
								</p>
							</div>
						</div>
						<div className='flex relative pb-12'>
							<div className='h-full w-10 absolute inset-0 flex items-center justify-center'>
								<div className='h-full w-1 bg-gray-200 pointer-events-none'></div>
							</div>
							<div className='flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10'>
								<Footprints />
							</div>
							<div className='flex-grow pl-4'>
								<h2 className='font-medium title-font text-sm text-gray-900 mb-1 tracking-wider'>
									ШАГ 2
								</h2>
								<p className='leading-relaxed'>
									Авторизуйтесь в системе, чтобы перейти к созданию расписания.
								</p>
							</div>
						</div>
						<div className='flex relative pb-12'>
							<div className='h-full w-10 absolute inset-0 flex items-center justify-center'>
								<div className='h-full w-1 bg-gray-200 pointer-events-none'></div>
							</div>
							<div className='flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10'>
								<Footprints />
							</div>
							<div className='flex-grow pl-4'>
								<h2 className='font-medium title-font text-sm text-gray-900 mb-1 tracking-wider'>
									ШАГ 3
								</h2>
								<p className='leading-relaxed'>
									Перейдите на страницу создания расписания и выделите нужные
									даты для генерации.
								</p>
							</div>
						</div>
						<div className='flex relative pb-12'>
							<div className='h-full w-10 absolute inset-0 flex items-center justify-center'>
								<div className='h-full w-1 bg-gray-200 pointer-events-none'></div>
							</div>
							<div className='flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10'>
								<Footprints />
							</div>
							<div className='flex-grow pl-4'>
								<h2 className='font-medium title-font text-sm text-gray-900 mb-1 tracking-wider'>
									ШАГ 4
								</h2>
								<p className='leading-relaxed'>
									Настройте параметры генерации: выберите предметы,
									преподавателей и другие настройки.
								</p>
							</div>
						</div>
						<div className='flex relative'>
							<div className='flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 inline-flex items-center justify-center text-white relative z-10'>
								<Footprints />
							</div>
							<div className='flex-grow pl-4'>
								<h2 className='font-medium title-font text-sm text-gray-900 mb-1 tracking-wider'>
									ШАГ 5
								</h2>
								<p className='leading-relaxed'>
									Нажмите кнопку "Сгенерировать" и получите готовое расписание.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
