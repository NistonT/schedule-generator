import { cabinetService } from "@/services/cabinets.service";
import { IAddCabinetForm } from "@/types/cabinet.type";
import { IUser } from "@/types/user.type";
import { useMutation } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

// Добавление кабинета
export const useAddCabinet = (profile: IUser | null, schedule_id: string) => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<IAddCabinetForm>();

	const { mutate } = useMutation({
		mutationKey: ["add_cabinet"],
		mutationFn: (data: string[]) =>
			cabinetService.addCabinets(data, profile!.api_key, schedule_id),
		onSuccess: () => {
			toast.success("Кабинет успешно добавлен");
			reset();
		},
		onError: error => {
			toast.error(error.message);
		},
	});

	const onSubmit: SubmitHandler<IAddCabinetForm> = data => {
		const list_cabinets: string[] = data.name.trim().split(/\s+/);

		mutate(list_cabinets);
	};

	return { onSubmit, register, handleSubmit, errors };
};
