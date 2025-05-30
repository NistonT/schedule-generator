import { IRegistrationForm } from "@/types/auth.type";
import { ReactNode, useState } from "react";
import { UseFormRegister } from "react-hook-form";
import { PasswordIsSee } from "./PasswordIsSee";

export enum EnumRegister {
	USERNAME = "username",
	EMAIL = "email",
	PASSWORD = "password",
	PASSWORD_CONFIRM = "passwordConfirm",
	IS_CONFIRM = "isConfirm",

	OLD_PASSWORD = "passwordOld",
	NEW_PASSWORD = "passwordNew",
	CONFIRM_PASSWORD = "passwordConfirm",
}

type Props = {
	register: UseFormRegister<IRegistrationForm> | any;
	errors: string | undefined | any;
	label: string;
	name: EnumRegister;
	icon?: ReactNode;
};

export const PasswordForm = ({
	register,
	errors,
	label,
	name,
	icon,
}: Props) => {
	const [isSee, setIsSee] = useState<boolean>(false);

	const handlerIsSeePassword = () => {
		setIsSee(!isSee);
	};

	return (
		<div className='mb-4'>
			<label
				htmlFor={name}
				className='leading-7 text-sm text-gray-950 select-none'
			>
				{label}
			</label>
			<div className='relative'>
				<div className='relative flex items-center'>
					<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-950'>
						{icon}
					</div>
					<input
						{...register(name, {
							required: true,
							minLength: {
								value: 6,
								message: `Имя пользователя должно содержать не менее ${6} символов`,
							},
							maxLength: {
								value: 255,
								message: `Имя пользователя должно содержать не более ${255} символов`,
							},
							pattern: {
								value: /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]+$/,
								message:
									"Пароль должен содержать хотя бы одну букву в нижнем регистре и хотя бы одну букву в верхнем регистре. Допускаются только латинские буквы и цифры",
							},
						})}
						type={`${isSee ? "text" : "password"}`}
						id={name}
						className='w-full bg-white rounded border border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 text-base outline-none text-gray-700 py-1 px-3 pl-10 leading-8 transition-colors duration-200 ease-in-out'
					/>

					<button
						className='absolute right-3'
						type='button'
						onClick={event => {
							event.preventDefault();
							handlerIsSeePassword();
						}}
					>
						<PasswordIsSee isSee={isSee} />
					</button>
				</div>
			</div>
			{errors && <p className='text-red-500 text-xs mt-1'>{errors}</p>}
		</div>
	);
};
