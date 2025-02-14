"use client";
import { ButtonSubmit } from "@/components/ui/buttons/ButtonSubmit";
import { Field } from "@/components/ui/fields/Field";
import { userService } from "@/services/user.service";
import { IUser, TypeUserForm } from "@/types/auth.types";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Calendar, CalendarSync, Info, Mail, Save, User } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
type Props = {
	data: IUser | undefined;
};

export const MainForm = ({ data }: Props) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<TypeUserForm>();

	const { mutate } = useMutation({
		mutationKey: ["update"],
		mutationFn: (data: TypeUserForm) => userService.update(data),
		onSuccess: () => {
			toast("Вы успешно обновили профиль!");
			location.reload();
		},
		onError: error => {
			toast(error.message);
		},
	});

	const onSubmit: SubmitHandler<TypeUserForm> = dataUpdate => {
		if (
			dataUpdate.username === data?.username &&
			dataUpdate.email === data.email
		) {
			toast("Вы ничего не изменили!");
			return;
		}

		if (dataUpdate.username === "" || dataUpdate.email === "") {
			toast("Вы оставили поле пустым!");
			return;
		}

		mutate(dataUpdate);
	};

	return (
		<div className='rounded-lg p-6 mb-6'>
			<h2 className='text-xl font-semibold text-gray-700 mb-6 border-b pb-2'>
				<div className='flex items-center gap-1'>
					<Info />
					<span>Основная информация</span>
				</div>
			</h2>
			<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
				<Field
					label={"Имя пользователя"}
					name={"username"}
					type={"text"}
					isRequired={false}
					required={""}
					register={register}
					errors={errors.username?.message}
					default={data?.username}
					icon={<User />}
					patternValue={/^(?=(?:.*[a-zA-Z]){3})[a-zA-Z0-9]+$/}
					patternMessage='Имя пользователя должно содержать хотя бы три английские буквы (нижний или верхний регистр). Допускаются только латинские буквы и цифры. Или имя пользователя занято.'
				/>
				<Field
					label={"Почта"}
					name={"email"}
					type={"email"}
					isRequired={false}
					required={""}
					register={register}
					errors={errors.email?.message}
					default={data?.email}
					icon={<Mail />}
					patternValue={/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/}
					patternMessage='Адрес электронной почты должен содержать:
Латинские буквы, цифры и символы перед @.
Доменное имя после @ и доменную зону (например, .com, .co.uk). Или почта занято.'
				/>
				<div>
					<label className='block text-sm font-medium text-gray-500'>
						Дата создания
					</label>
					<div className='flex items-center gap-2 mt-1'>
						<Calendar className='w-5 h-5 text-gray-400' />
						<p className='text-lg text-gray-900'>
							{dayjs(data?.CreatedAt).format("DD.MM.YYYY HH:mm")}
						</p>
					</div>
				</div>
				<div>
					<label className='block text-sm font-medium text-gray-500'>
						Дата обновления
					</label>
					<div className='flex items-center gap-2 mt-1'>
						<CalendarSync className='w-5 h-5 text-gray-400' />
						<p className='text-lg text-gray-900'>
							{dayjs(data?.UpdatedAt).format("DD.MM.YYYY HH:mm")}
						</p>
					</div>
				</div>
				<div>
					<ButtonSubmit title={"Сохранить"} icon={<Save />} />
				</div>
			</form>
		</div>
	);
};
