import { feedbackService } from "@/services/feedback.service";
import { IAddFeedback } from "@/types/feedback.type";
import { IUser } from "@/types/user.type";
import { useMutation } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

export const usePostFeedback = (profile: IUser | undefined) => {
	const { register, handleSubmit, reset } = useForm<IAddFeedback>();
	const { mutate } = useMutation({
		mutationKey: ["feedback_add"],
		mutationFn: (data: IAddFeedback) =>
			feedbackService.addFeedback(data, profile!.id),
		onSuccess: () => {
			toast.success("Запись отправленна!");
			reset();
		},
		onError: error => {
			toast.error(error.message);
		},
	});

	const onSubmit: SubmitHandler<IAddFeedback> = data => {
		mutate(data);
	};

	return { register, handleSubmit, onSubmit };
};
