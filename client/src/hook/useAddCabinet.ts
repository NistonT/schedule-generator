import { cabinetsAtom } from "@/jotai/schedule";
import { cabinetService } from "@/services/cabinets.service";
import { IAddCabinetForm } from "@/types/cabinet.type";
import { IUser } from "@/types/user.type";
import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai";
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

	const [cabinets, setCabinets] = useAtom(cabinetsAtom);

	const { mutate } = useMutation({
		mutationKey: ["add_cabinet", schedule_id],
		mutationFn: (data: string[]) =>
			cabinetService.addCabinets(data, profile!.api_key, schedule_id),
		onMutate: async newCabs => {
			// Предварительно фильтруем дубликаты
			const filtered = newCabs.filter(c => !cabinets.includes(c));
			if (!filtered.length) {
				toast.info("Все кабинеты уже добавлены");
				return Promise.reject("Дубликаты");
			}
			return { filtered };
		},
		onSuccess: (data, variables, context) => {
			// Добавляем только уникальные кабинеты в jotai
			const { filtered } = context as { filtered: string[] };

			setCabinets(prev => [...prev, ...filtered]);
			toast.success(`Добавлено ${filtered.length} кабинет(ов)`);
			reset();
		},
		onError: () => {
			toast.error("Ошибка при добавлении кабинета");
		},
	});

	const onSubmit: SubmitHandler<IAddCabinetForm> = data => {
		const list_cabinets: string[] = data.name.trim().split(/\s+/);

		mutate(list_cabinets);
	};

	return { onSubmit, register, handleSubmit, errors, cabinets };
};
