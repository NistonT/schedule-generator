import { dataProfileAtom } from "@/jotai/generation";
import { cabinetService } from "@/services/cabinets.service";
import { IUser } from "@/types/auth.types";
import { IAddField } from "@/types/generation.types";
import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { ButtonGeneration } from "../ui/buttons/ButtonGeneration";
import { EnumTypeField } from "./MainField";

type Props = {
	label: string;
	name: string;
	field: EnumTypeField;
};

export const AddField = ({ label, name, field }: Props) => {
	const { register, handleSubmit, reset } = useForm<IAddField>();
	const [dataProfile, setDataProfile] = useAtom<IUser | null>(dataProfileAtom);

	const { mutate: addCabinet } = useMutation({
		mutationKey: ["addFieldCabinet"],
		mutationFn: (data: IAddField) =>
			cabinetService.addCabinets(data, dataProfile!.api_key),
		onSuccess: () => {
			toast.success("Кабинет добавлен");
			reset();
			location.reload();
		},
		onError: (error: any) => {
			toast.error(error.response.data.message);
		},
	});

	const onSubmit: SubmitHandler<IAddField> = data => {
		if (field === "CABINETS") {
			addCabinet(data);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<input
				{...register("name")}
				type='text'
				id={name}
				className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
			/>
			<ButtonGeneration title={"Добавить"} />
		</form>
	);
};
