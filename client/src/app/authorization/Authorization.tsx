"use client";

import { ButtonLink } from "@/components/ui/buttons/ButtonLink";
import { ButtonSubmit } from "@/components/ui/buttons/ButtonSubmit";
import { Field } from "@/components/ui/fields/Field";
import { Title } from "@/components/ui/headers/Title";
import { DASHBOARD_PAGES } from "@/config/pages-url.config";
import { authService } from "@/services/auth.service";
import { IAuthForm } from "@/types/auth.types";
import { useMutation } from "@tanstack/react-query";
import { Lock, LogIn, User, UserPlus } from "lucide-react";
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
				<div className='flex items-center justify-between'>
					<Title title={"Авторизация"} />
					<ButtonLink
						href={DASHBOARD_PAGES.REGISTRATION}
						title={"Регистрация"}
						icon={<UserPlus />}
					/>
				</div>
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

					<Field
						label={"Пароль"}
						name={"password"}
						type={"password"}
						isRequired={true}
						required={"Введите пароль"}
						register={register}
						errors={errors.password?.message}
						minLengthValue={6}
						maxLengthValue={64}
						icon={<Lock />}
					/>

					<ButtonSubmit title={"Войти"} icon={<LogIn />} />
				</form>
				<div className='flex flex-col space-y-4 items-center text-center max-w-md mx-auto'>
					<div className='text-sm text-gray-600'>
						<Link
							href={DASHBOARD_PAGES.HOME}
							className='text-blue-600 hover:text-blue-800 transition-colors duration-300 underline font-medium'
						>
							Вернуться на главную
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};
