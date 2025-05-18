import { DASHBOARD_PAGES } from "@/config/pages-url.config";
import { authService } from "@/services/auth.service";
import { IRegistrationForm, IRegistrationRequest } from "@/types/auth.type";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

export const useRegistration = () => {
	const {
		register,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm<IRegistrationForm>({
		mode: "onChange",
	});

	const { push } = useRouter();
	const [message, setMessage] = useState<string>("");
	const [isError, setIsError] = useState<boolean>(false);

	const { mutate } = useMutation({
		mutationKey: ["registration"],
		mutationFn: (data: IRegistrationRequest) => authService.registerMain(data),
		onSuccess: () => {
			toast.success("Регистрация прошла успешно");
			reset();
			push(DASHBOARD_PAGES.AUTHORIZATION);
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

	return { onSubmit, register, errors, message, isError, handleSubmit };
};
