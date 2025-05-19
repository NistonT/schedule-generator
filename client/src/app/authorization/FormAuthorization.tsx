import { EnumRegister, PasswordForm } from "@/components/PasswordForm";
import { ButtonSubmit } from "@/components/ui/buttons/ButtonSubmit";
import { Field } from "@/components/ui/fields/Field";
import { IAuthorizationForm } from "@/types/auth.type";
import { Lock, LogIn, User } from "lucide-react";
import {
	FieldErrors,
	SubmitErrorHandler,
	SubmitHandler,
	UseFormRegister,
} from "react-hook-form";

type Props = {
	handleSubmit: (
		onValid: SubmitHandler<IAuthorizationForm>,
		onInvalid?: SubmitErrorHandler<IAuthorizationForm> | undefined
	) => (e?: React.BaseSyntheticEvent) => Promise<void>;
	onSubmit: SubmitHandler<IAuthorizationForm>;
	register: UseFormRegister<IAuthorizationForm>;
	errors: FieldErrors<IAuthorizationForm>;
};

export const FormAuthorization = ({
	handleSubmit,
	onSubmit,
	register,
	errors,
}: Props) => {
	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
				{/* Поле - имя пользователя */}
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

				{/* Поле - пароль */}
				<PasswordForm
					register={register}
					errors={errors.password?.message}
					label={"Пароль"}
					name={EnumRegister.PASSWORD}
					icon={<Lock />}
				/>

				{/* Кнопка отправление формы */}
				<ButtonSubmit title={"Войти"} icon={<LogIn />} />
			</form>
		</>
	);
};
