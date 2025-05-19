"use client";

import { ButtonMotionLink } from "@/components/ui/buttons/ButtonMotionLink";
import { Title } from "@/components/ui/headers/Title";
import { DASHBOARD_PAGES } from "@/config/pages-url.config";
import { motionAuthorization } from "@/constants/motion.constants";
import { useAuthorization } from "@/hook/useAuthorization";
import { UserPlus } from "lucide-react";
import { m } from "motion/react";
import Link from "next/link";
import { FormAuthorization } from "./FormAuthorization";

export const Authorization = () => {
	// хук на авторизацию
	const { onSubmit, register, handleSubmit, errors } = useAuthorization();

	return (
		<div className='min-h-screen flex items-center justify-center'>
			<div className='w-full max-w-md p-8 space-y-3 bg-white backdrop-blur-lg'>
				{/* Первый блок */}
				<m.div
					{...motionAuthorization}
					className='flex items-center justify-between'
				>
					<Title title={"Авторизация"} />
					<ButtonMotionLink
						href={DASHBOARD_PAGES.REGISTRATION}
						title={"Регистрация"}
						icon={<UserPlus />}
					/>
				</m.div>
				{/* Форма */}
				<FormAuthorization
					handleSubmit={handleSubmit}
					onSubmit={onSubmit}
					register={register}
					errors={errors}
				/>
				<m.div
					{...motionAuthorization}
					className='flex flex-col space-y-4 items-center text-center max-w-md mx-auto'
				>
					{/* Ссылка на главную страницу */}
					<div className='text-sm text-gray-600'>
						<Link
							href={DASHBOARD_PAGES.HOME}
							className='text-gray-950 hover:text-gray-800 transition-colors duration-300 underline font-medium'
						>
							Вернуться на главную
						</Link>
					</div>
				</m.div>
			</div>
		</div>
	);
};
