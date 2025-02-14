"use client";
import { EnumRegister, PasswordForm } from "@/components/PasswordForm";
import { ButtonSubmit } from "@/components/ui/buttons/ButtonSubmit";
import { Field } from "@/components/ui/fields/Field";
import { userService } from "@/services/user.service";
import {
	IPassword,
	IUpdatePassword,
	IUser,
	TypeUserForm,
} from "@/types/auth.types";
import { useMutation } from "@tanstack/react-query";
import { KeyRound, KeySquare, Save, Shield } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
	data: IUser | undefined;
};

export const PasswordSettingForm = ({ data }: Props) => {
	const [isModal, setIsModal] = useState<boolean>(false);

	const handlerIsModal = () => {
		setIsModal(!isModal);
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IUpdatePassword>();

	const { mutate } = useMutation({
		mutationKey: ["updatePassword"],
		mutationFn: (password: TypeUserForm) => userService.update(password),
		onSuccess: () => {
			toast("Вы успешно изменили пароль!");
			location.reload();
		},
	});

	const { mutate: PasswordCheck } = useMutation({
		mutationKey: ["updatePassword"],
		mutationFn: (password: IPassword) => userService.check(password),
		onSuccess: () => {
			return true;
		},
		onError: () => {
			toast("Старый пароль неверный");
			return false;
		},
	});

	const onSubmit: SubmitHandler<IUpdatePassword> = formData => {
		const userData: TypeUserForm = {
			username: data!.username || "",
			email: data!.email || "",
			password: formData.password,
			schedule_id: data!.schedule_id,
			api_key: data!.api_key,
			CreatedAt: data!.CreatedAt,
			UpdatedAt: data!.UpdatedAt,
		};

		PasswordCheck({ password: formData.password });

		console.log(formData.passwordConfirm);
		console.log(formData.password);

		if (formData.passwordConfirm !== formData.password) {
			toast("Подтвержденный пароль неверный");
			return;
		}

		mutate(userData);
	};

	return (
		<>
			<div className='bg-white rounded-lg p-6'>
				<h2 className='text-xl font-semibold text-gray-700 mb-6 border-b pb-2'>
					<div className='flex items-center gap-1'>
						<Shield />
						<span>Безопасность</span>
					</div>
				</h2>
				<div onClick={handlerIsModal}>
					<ButtonSubmit title={"Изменить пароль"} icon={<KeyRound />} />
				</div>
			</div>

			{isModal && (
				<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
					<div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-md'>
						<h2 className='text-xl font-semibold text-gray-700 mb-4'>
							Изменение пароля
						</h2>

						<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
							<Field
								label={"Старый пароль"}
								name={"passwordOld"}
								type={"password"}
								isRequired={false}
								required={"Введите прошлый пароль"}
								register={register}
								errors={errors.passwordOld?.message}
								icon={<KeySquare />}
							/>
							<PasswordForm
								register={register}
								errors={errors.password?.message}
								label={"Новый пароль"}
								name={EnumRegister.PASSWORD}
								icon={<KeySquare />}
							/>
							<PasswordForm
								register={register}
								errors={errors.passwordConfirm?.message}
								label={"Подтвердите новый пароль"}
								name={EnumRegister.CONFIRM_PASSWORD}
								icon={<KeySquare />}
							/>

							<div className='flex justify-end gap-3'>
								<button
									type='button'
									onClick={handlerIsModal}
									className='bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors'
								>
									Отмена
								</button>
								<ButtonSubmit title={"Сохранить"} icon={<Save />} />
							</div>
						</form>
					</div>
				</div>
			)}
		</>
	);
};
