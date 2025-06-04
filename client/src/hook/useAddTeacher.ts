import { teachersGenerationAtom } from "@/jotai/generation";
import { teachersAtom } from "@/jotai/schedule";
import { teachersService } from "@/services/teachers.service";
import { IAddTeacherForm } from "@/types/teacher.type";
import { IUser } from "@/types/user.type";
import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const useAddTeacher = (profile: IUser | null, schedule_id: string) => {
	const [teachers, setTeachers] = useAtom(teachersAtom);
	const [teachersGeneration, setTeachersGeneration] = useAtom(
		teachersGenerationAtom
	);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<IAddTeacherForm>();

	const { mutate } = useMutation({
		mutationFn: (names: string[]) =>
			teachersService.addTeachers(names, profile!.api_key, schedule_id),
		onMutate: names => {
			const filtered = names.filter(
				name => !teachers.some(t => t.name === name)
			);
			return { filtered };
		},
		onSuccess: (data, _, context) => {
			const { filtered } = context as { filtered: string[] };

			const newTeachers = filtered.map(name => ({
				tid: Date.now() + Math.random(),
				name,
				schedule_id,
			}));

			setTeachers(prev => [...prev, ...newTeachers]);
			setTeachersGeneration(prev => [...prev, ...newTeachers]);

			toast.success(`Добавлено ${filtered.length} преподаватель(ей)`);
			reset();
		},
	});

	const onSubmit = (data: IAddTeacherForm) => {
		const list_teachers = data.name.trim().split(/\s+/);
		mutate(list_teachers);
	};

	return { onSubmit, register, handleSubmit, errors };
};
