"use client";

import { dataProfileAtom } from "@/jotai/generation";
import { cabinetService } from "@/services/cabinets.service";
import { IUser } from "@/types/auth.types";
import { IDeleteField } from "@/types/generation.types";
import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Delete } from "lucide-react";
import { toast } from "sonner";
import { ButtonSubmit } from "../ui/buttons/ButtonSubmit";
import { EnumTypeField } from "./MainField";

type Props = {
	fieldElem: any;
	field: EnumTypeField;
};

export const DeleteField = ({ fieldElem, field }: Props) => {
	const [dataProfile, setDataProfile] = useAtom<IUser | null>(dataProfileAtom);

	const { mutate: deleteCabinet } = useMutation({
		mutationKey: ["deleteFieldCabinet"],
		mutationFn: (data: IDeleteField) =>
			cabinetService.deleteCabinets(data, dataProfile!.api_key),
		onSuccess: () => {
			toast.success("Кабинет успешно удален");
			location.reload();
		},
	});

	const handlerSubmit = () => {
		const data: IDeleteField = {
			name: fieldElem,
		};

		if (field === "CABINETS") {
			deleteCabinet(data);
		}
	};

	return (
		<>
			<ButtonSubmit
				title={"Удалить"}
				icon={<Delete />}
				onClick={handlerSubmit}
			/>
		</>
	);
};
