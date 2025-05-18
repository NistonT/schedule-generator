import { EnumRegister, PasswordForm } from "@/components/PasswordForm";
import { ButtonSubmit } from "@/components/ui/buttons/ButtonSubmit";
import { CheckboxConfirm } from "@/components/ui/checkbox/CheckboxConfirm";
import { Field } from "@/components/ui/fields/Field";
import { motionRegistration } from "@/constants/motion.constants";
import { IRegistrationForm } from "@/types/auth.type";
import { KeySquare, Mail, User, UserPlus } from "lucide-react";
import { m } from "motion/react";
import {
	FieldErrors,
	SubmitErrorHandler,
	SubmitHandler,
	UseFormRegister,
} from "react-hook-form";

type Props = {
	handleSubmit: (
		onValid: SubmitHandler<IRegistrationForm>,
		onInvalid?: SubmitErrorHandler<IRegistrationForm> | undefined
	) => (e?: React.BaseSyntheticEvent) => Promise<void>;
	onSubmit: SubmitHandler<IRegistrationForm>;
	register: UseFormRegister<IRegistrationForm>;
	errors: FieldErrors<IRegistrationForm>;
	isError: boolean;
	message: string;
};

export const FormRegistration = ({
	handleSubmit,
	onSubmit,
	register,
	errors,
	isError,
	message,
}: Props) => {
	return (
		<>
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
				<m.div {...motionRegistration} className='text-red-500 text-sm mt-2'>
					{errors.isConfirm?.message}
				</m.div>

				{isError && (
					<m.div {...motionRegistration} className='text-red-500 text-sm mt-2'>
						{message}
					</m.div>
				)}

				<ButtonSubmit title={"Зарегистрироваться"} icon={<UserPlus />} />
			</form>
		</>
	);
};
