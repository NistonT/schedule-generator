import { showScheduleService } from "@/services/show-schedule.service";
import { ISchedule } from "@/types/schedule.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { m } from "motion/react";
import { useState } from "react";

type Props = {
	schedule: ISchedule;
	apiKey: string;
};

export const IsShow = ({ schedule, apiKey }: Props) => {
	const queryClient = useQueryClient();
	const [isShow, setIsShow] = useState(schedule.isShow);

	const { mutate, isPending } = useMutation({
		mutationKey: ["show-schedule", schedule.id],
		mutationFn: () => showScheduleService.showSchedule(apiKey, schedule.id),
		onMutate: async () => {
			// Оптимистическое обновление
			setIsShow(prev => !prev);
		},
		onSuccess: updatedSchedule => {
			// Обновляем локально
			setIsShow(updatedSchedule.data.isShow);
		},
		onError: (error, variables, context) => {
			// Откатываем изменения при ошибке
			setIsShow(prev => !prev);
			console.error("Ошибка при изменении статуса расписания", error);
		},
	});

	return (
		<m.button
			type='button'
			whileTap={{ scale: 0.98 }}
			onClick={() => mutate()}
			disabled={isPending}
			className={`inline-flex items-center gap-2 px-4 py-1 text-lg font-medium rounded-full transition-colors ${
				isShow
					? "bg-gray-100 text-gray-700 hover:bg-gray-200"
					: "bg-gray-100 text-gray-700 hover:bg-gray-200"
			}`}
		>
			{isShow ? "Активна" : "Скрыто"}
			{isShow ? <Eye className='w-4 h-4' /> : <EyeOff className='w-4 h-4' />}
		</m.button>
	);
};
