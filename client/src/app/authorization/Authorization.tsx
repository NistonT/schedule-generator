"use client";

import { EnumRegister, PasswordForm } from "@/components/PasswordForm";
import { ButtonMotionLink } from "@/components/ui/buttons/ButtonMotionLink";
import { ButtonSubmit } from "@/components/ui/buttons/ButtonSubmit";
import { Field } from "@/components/ui/fields/Field";
import { Title } from "@/components/ui/headers/Title";
import { DASHBOARD_PAGES } from "@/config/pages-url.config";
import { authService } from "@/services/auth.service";
import { IAuthForm } from "@/types/auth.types";
import { useMutation } from "@tanstack/react-query";
import { Lock, LogIn, User, UserPlus } from "lucide-react";
import { m } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

export const Authorization = () => {
	const {
		register,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm<IAuthForm>({
		mode: "onChange",
	});

	const { push } = useRouter();

	const { mutate } = useMutation({
		mutationKey: ["auth"],
		mutationFn: (data: IAuthForm) => authService.loginMain(data),
		onSuccess: () => {
			toast.success("Авторизация прошла успешно");
			reset();
			push(DASHBOARD_PAGES.PROFILE);
		},
		onError: error => {
			console.log(error);
		},
	});

	const onSubmit: SubmitHandler<IAuthForm> = data => {
		mutate(data);
	};

	return (
		<div className='min-h-screen flex items-center justify-center'>
			<div className='w-full max-w-md p-8 space-y-3 bg-white backdrop-blur-lg'>
				<m.div
					initial={{
						opacity: 0,
						y: -20,
					}}
					animate={{
						opacity: 1,
						y: 0,
					}}
					transition={{
						duration: 0.2,
					}}
					className='flex items-center justify-between'
				>
					<Title title={"Авторизация"} />
					<ButtonMotionLink
						href={DASHBOARD_PAGES.REGISTRATION}
						title={"Регистрация"}
						icon={<UserPlus />}
					/>
				</m.div>
				<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
					<Field
						label={"Имя пользователя"}
						name={"username"}
						type={"text"}
						isRequired={true}
						required={"Введите имя пользователя"}
						register={register}
						errors={errors.username?.message}
						minLengthValue={3}
						maxLengthValue={64}
						icon={<User />}
					/>

					<PasswordForm
						register={register}
						errors={errors.password?.message}
						label={"Пароль"}
						name={EnumRegister.PASSWORD}
						icon={<Lock />}
					/>

					<ButtonSubmit title={"Войти"} icon={<LogIn />} />
				</form>
				<m.div
					initial={{
						opacity: 0,
						x: -20,
					}}
					animate={{
						opacity: 1,
						x: 0,
					}}
					transition={{
						duration: 0.2,
					}}
					className='flex flex-col space-y-4 items-center text-center max-w-md mx-auto'
				>
					<div className='text-sm text-gray-600'>
						<Link
							href={DASHBOARD_PAGES.HOME}
							className='text-blue-600 hover:text-blue-800 transition-colors duration-300 underline font-medium'
						>
							Вернуться на главную
						</Link>
					</div>
				</m.div>
			</div>
		</div>
	);
};
