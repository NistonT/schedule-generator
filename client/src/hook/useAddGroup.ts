import { groupsGenerationAtom } from "@/jotai/generation";
import { groupsAtom } from "@/jotai/schedule";
import { groupService } from "@/services/groups.service";
import { IAddGroupForm } from "@/types/group.type";
import { IUser } from "@/types/user.type";
import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const useAddGroup = (profile: IUser | null, schedule_id: string) => {
	const [groupsGeneration, setGroupGeneration] = useAtom(groupsGenerationAtom);
	const [groups, setGroups] = useAtom(groupsAtom);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<IAddGroupForm>();

	const mutation = useMutation({
		mutationFn: (data: string[]) =>
			groupService.addGroups(data, profile!.api_key, schedule_id),
		onMutate: newGroups => {
			const filtered = newGroups.filter(g => !groups.includes(g));
			if (!filtered.length) {
				toast.info("Все группы уже добавлены");
				throw new Error("Дубликаты");
			}
			return { filtered };
		},
		onSuccess: (data, variables, context) => {
			const { filtered } = context as { filtered: string[] };

			setGroupGeneration(prev => [...prev, ...filtered]);
			setGroups(prev => [...prev, ...filtered]);

			toast.success(`Добавлено ${filtered.length} групп(а)`);
			reset();
		},
		onError: error => {
			console.error("Ошибка при добавлении группы:", error);
			toast.error("Ошибка при добавлении группы");
		},
	});

	const onSubmit = (data: IAddGroupForm) => {
		const list_groups = data.name.trim().split(/\s+/);
		console.log(list_groups);
		mutation.mutate(list_groups);
	};

	return { onSubmit, register, handleSubmit, errors };
};
