"use client";
import { ButtonMotionLink } from "@/components/ui/buttons/ButtonMotionLink";
import { Title } from "@/components/ui/headers/Title";
import { DASHBOARD_PAGES } from "@/config/pages-url.config";
import { motionRegistration } from "@/constants/motion.constants";
import { useRegistration } from "@/hook/useRegistration";
import { LogIn } from "lucide-react";
import { m } from "motion/react";
import Link from "next/link";
import { FormRegistration } from "./FormRegistration";

export const Registration = () => {
	const { onSubmit, register, errors, message, isError, handleSubmit } =
		useRegistration();

	return (
		<div className='min-h-screen flex items-center justify-center'>
			<div className='w-full max-w-md p-8 space-y-3 bg-white backdrop-blur-lg'>
				<m.div
					{...motionRegistration}
					className='flex items-center justify-between'
				>
					<Title title={"Регистрация"} />
					<ButtonMotionLink
						href={DASHBOARD_PAGES.AUTHORIZATION}
						title={"Авторизация"}
						icon={<LogIn />}
					/>
				</m.div>
				<FormRegistration
					handleSubmit={handleSubmit}
					onSubmit={onSubmit}
					register={register}
					errors={errors}
					isError={isError}
					message={message}
				/>
				<m.div
					{...motionRegistration}
					className='flex flex-col space-y-4 items-center text-center max-w-md mx-auto'
				>
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
