import { cabinetsAtom } from "@/jotai/schedule";
import { cabinetService } from "@/services/cabinets.service";
import { IUser } from "@/types/auth.types";
import { IAddCabinet } from "@/types/cabinet.types";
import { ISchedule } from "@/types/schedule.types";
import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
	profile: IUser;
	schedule: ISchedule;
};

export const CabinetForm = ({ profile, schedule }: Props) => {
	const [cabinets, setCabinets] = useAtom(cabinetsAtom);

	const { register, handleSubmit, reset } = useForm<IAddCabinet>();

	const { mutate } = useMutation({
		mutationKey: ["get_cabinets"],
		mutationFn: (name: string[] | string) =>
			cabinetService.addCabinets(name, profile!.api_key, schedule.id),
		onSuccess: response => {
			toast.success("Добавлено");
			setCabinets(prev => [...(prev || []), response.data]);
			reset();
		},
	});

	const onSubmit: SubmitHandler<IAddCabinet> = data => {
		const { name } = data;

		let array: string[];

		if (typeof name === "string") {
			array = name.split(" ");
		} else {
			array = name;
		}

		mutate(array);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
			<div>
				<label
					htmlFor='name'
					className='block text-sm font-medium text-gray-700'
				>
					Название кабинетов
				</label>
				<input
					id='name'
					{...register("name", { required: true })}
					className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
					placeholder='Введите названия через пробел'
				/>
			</div>

			<button
				type='submit'
				className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
			>
				Добавить
			</button>
		</form>
	);
};
