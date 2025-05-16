"use client";

import { dataProfileAtom } from "@/jotai/generation";
import { cabinetService } from "@/services/cabinets.service";
import { groupService } from "@/services/groups.service";
import { teachersService } from "@/services/teachers.service";
import { IUser } from "@/types/auth.type";
import { IDeleteField } from "@/types/generation.type";
import { useMutation } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { Delete } from "lucide-react";
import { toast } from "sonner";
import { ButtonSubmit } from "../ui/buttons/ButtonSubmit";
import { EnumTypeField } from "./MainField";

type Props = {
	fieldElem: any;
	field: EnumTypeField;
};

export const DeleteField = ({ fieldElem, field }: Props) => {
	const dataProfile = useAtomValue<IUser | null>(dataProfileAtom);

	const { mutate: deleteCabinet } = useMutation({
		mutationKey: ["deleteFieldCabinet"],
		mutationFn: (data: IDeleteField) =>
			cabinetService.deleteCabinets(data, dataProfile!.api_key),
		onSuccess: () => {
			toast.success("Кабинет успешно удален");
			location.reload();
		},
		onError: (error: any) => {
			toast.success(error.response.data.message);
		},
	});

	const { mutate: deleteGroup } = useMutation({
		mutationKey: ["deleteFieldGroup"],
		mutationFn: (data: IDeleteField) =>
			groupService.deleteGroups(data, dataProfile!.api_key),
		onSuccess: () => {
			toast.success("Группа успешно удален");
			location.reload();
		},
		onError: (error: any) => {
			toast.success(error.response.data.message);
		},
	});

	const { mutate: deleteTeacher } = useMutation({
		mutationKey: ["deleteFieldTeacher"],
		mutationFn: (data: IDeleteField) =>
			teachersService.deleteTeachers(data, dataProfile!.api_key),
		onSuccess: () => {
			toast.success("Группа успешно удален");
			location.reload();
		},
		onError: (error: any) => {
			toast.success(error.response.data.message);
		},
	});

	const handlerSubmit = () => {
		const data: IDeleteField = {
			name: fieldElem,
		};

		if (field === "CABINETS") {
			deleteCabinet(data);
		} else if (field === "GROUP") {
			deleteGroup(data);
		} else if (field === "TEACHERS") {
			deleteTeacher(data);
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
