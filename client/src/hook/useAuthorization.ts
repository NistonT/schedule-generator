import { DASHBOARD_PAGES } from "@/config/pages-url.config";
import { authService } from "@/services/auth.service";
import { IAuthorizationForm } from "@/types/auth.type";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

export const useAuthorization = () => {
	// хук для формы
	const {
		register,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm<IAuthorizationForm>({
		mode: "onChange",
	});

	// хук для редиректа
	const { push } = useRouter();

	// хук для запроса
	const { mutate } = useMutation({
		mutationKey: ["auth"],
		mutationFn: (data: IAuthorizationForm) => authService.loginMain(data),
		onSuccess: () => {
			toast.success("Авторизация прошла успешно");
			reset();
			push(DASHBOARD_PAGES.PROFILE);
		},
		onError: error => {
			toast.error("Произошла ошибка!");
			console.log(error);
		},
	});

	// функция для оправление запроса
	const onSubmit: SubmitHandler<IAuthorizationForm> = data => {
		mutate(data);
	};

	return { onSubmit, register, handleSubmit, errors };
};
