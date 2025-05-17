"use client";
import { EnumRegister, PasswordForm } from "@/components/PasswordForm";
import { ButtonMotionLink } from "@/components/ui/buttons/ButtonMotionLink";
import { ButtonSubmit } from "@/components/ui/buttons/ButtonSubmit";
import { CheckboxConfirm } from "@/components/ui/checkbox/CheckboxConfirm";
import { Field } from "@/components/ui/fields/Field";
import { Title } from "@/components/ui/headers/Title";
import { DASHBOARD_PAGES } from "@/config/pages-url.config";
import { authService } from "@/services/auth.service";
import { IRegistrationForm, IRegistrationRequest } from "@/types/auth.type";
import { useMutation } from "@tanstack/react-query";
import { KeySquare, LogIn, Mail, User, UserPlus } from "lucide-react";
import { m } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

export const Registration = () => {
	const {
		register,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm<IRegistrationForm>({
		mode: "onChange",
	});

	const [message, setMessage] = useState<string>("");
	const [isError, setIsError] = useState<boolean>(false);

	const { mutate } = useMutation({
		mutationKey: ["reg"],
		mutationFn: (data: IRegistrationRequest) => authService.registerMain(data),
		onSuccess: () => {
			toast.success("Регистрация прошла успешно");
			reset();
		},
		onError: error => {
			console.log(error);
			setMessage(error.message);
		},
	});

	const onSubmit: SubmitHandler<IRegistrationForm> = data => {
		const { passwordConfirm, isConfirm, ...result } = data;
		setIsError(false);
		setMessage("");
		if (passwordConfirm !== result.password) {
			setMessage("Пароли не совпадают");
			setIsError(true);
			return;
		}

		if (!isConfirm) {
			setMessage("Подтвердите соглашение");
			setIsError(true);
			return;
		}
		mutate(result);
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
					<Title title={"Регистрация"} />
					<ButtonMotionLink
						href={DASHBOARD_PAGES.AUTHORIZATION}
						title={"Авторизация"}
						icon={<LogIn />}
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
						maxLengthValue={50}
						patternValue={/^(?=(?:.*[a-zA-Z]){3})[a-zA-Z0-9]+$/}
						patternMessage='Имя пользователя должно содержать хотя бы три английские буквы (нижний или верхний регистр). Допускаются только латинские буквы и цифры. Или имя пользователя занято.'
						icon={<User />}
					/>

					<Field
						label={"Почта"}
						name={"email"}
						type={"email"}
						isRequired={true}
						required={"Введите почту"}
						register={register}
						errors={errors.email?.message}
						minLengthValue={3}
						maxLengthValue={100}
						patternValue={/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/}
						patternMessage='Адрес электронной почты должен содержать:
		Латинские буквы, цифры и символы перед @.
		Доменное имя после @ и доменную зону (например, .com, .co.uk). Или почта занято.'
						icon={<Mail />}
					/>

					<PasswordForm
						register={register}
						errors={errors["password"]?.message}
						label={"Пароль"}
						name={EnumRegister.PASSWORD}
						icon={<KeySquare />}
					/>

					<PasswordForm
						register={register}
						errors={errors.passwordConfirm?.message}
						label={"Подтвердите пароль"}
						name={EnumRegister.PASSWORD_CONFIRM}
						icon={<KeySquare />}
					/>

					<CheckboxConfirm
						label={"Я согласен с условиями использования"}
						name={"isConfirm"}
						register={register}
						required={"Вы должны подтвердить условия использования"}
					/>
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
						className='text-red-500 text-sm mt-2'
					>
						{errors.isConfirm?.message}
					</m.div>

					{isError && (
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
							className='text-red-500 text-sm mt-2'
						>
							{message}
						</m.div>
					)}

					<ButtonSubmit title={"Зарегистрироваться"} icon={<UserPlus />} />
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
