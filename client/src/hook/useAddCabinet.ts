import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { cabinetsGenerationAtom } from "@/jotai/generation";
import { cabinetsAtom } from "@/jotai/schedule";
import { cabinetService } from "@/services/cabinets.service";
import { IAddCabinetForm } from "@/types/cabinet.type";
import { IUser } from "@/types/user.type";

export const useAddCabinet = (profile: IUser | null, schedule_id: string) => {
	const [cabinetsGeneration, setCabinetsGeneration] = useAtom(
		cabinetsGenerationAtom
	);
	const [cabinets, setCabinets] = useAtom(cabinetsAtom);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<IAddCabinetForm>();

	const { mutate } = useMutation({
		mutationFn: (data: string[]) =>
			cabinetService.addCabinets(data, profile!.api_key, schedule_id),
		onMutate: newCabs => {
			// Фильтруем дубликаты
			const filtered = newCabs.filter(c => !cabinets.includes(c));
			if (!filtered.length) {
				toast.info("Все кабинеты уже добавлены");
				throw new Error("Дубликаты");
			}
			return { filtered };
		},
		onSuccess: (data, variables, context) => {
			const { filtered } = context as { filtered: string[] };

			// Добавляем в generationAtom первый кабинет или все
			if (filtered.length === 1) {
				setCabinetsGeneration(prev => [...prev, filtered[0]]);
			} else {
				setCabinetsGeneration(prev => [...prev, ...filtered]);
			}

			// Обновляем общий список кабинетов
			setCabinets(prev => [...prev, ...filtered]);

			toast.success(`Добавлено ${filtered.length} кабинет(ов)`);
			reset();
		},
		onError: () => {
			toast.error("Ошибка при добавлении кабинета");
		},
	});

	const onSubmit = (data: IAddCabinetForm) => {
		const list_cabinets = data.name.trim().split(/\s+/);
		console.log(list_cabinets);
		mutate(list_cabinets);
	};

	return { onSubmit, register, handleSubmit, errors };
};
