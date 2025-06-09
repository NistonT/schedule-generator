import { titleScheduleService } from "@/services/title-schedule.service";
import { ISchedule } from "@/types/schedule.type";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
	schedule: ISchedule;
	apiKey: string;
};

export const Title = ({ schedule, apiKey }: Props) => {
	const [isEditing, setIsEditing] = useState(false);
	const [title, setTitle] = useState(schedule.title);
	const [error, setError] = useState<string | null>(null);

	const { mutate, isPending } = useMutation({
		mutationKey: ["update_title"],
		mutationFn: () => titleScheduleService.addTitle(title, apiKey, schedule.id),
		onSuccess: updatedSchedule => {
			setTitle(updatedSchedule.data.title);
			setIsEditing(false);
			toast.success("Название успешна измененина");
		},
		onError: error => {
			toast.error(error.message);
		},
	});

	const handleSave = () => {
		const trimmedTitle = title.replace(/\s+/g, "");
		if (trimmedTitle.length < 6) {
			setError("Название должно содержать минимум 6 символов");
			return;
		}

		setError(null);
		mutate();
	};

	const handleCancel = () => {
		setTitle(schedule.title);
		setError(null);
		setIsEditing(false);
	};

	return (
		<div className='mb-6'>
			{isEditing ? (
				<div className='space-y-3'>
					<input
						type='text'
						value={title}
						onChange={e => setTitle(e.target.value)}
						placeholder='Введите новое название'
						className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
							error
								? "border-red-500 focus:ring-red-500 ring-1 ring-red-500"
								: "border-gray-300 focus:ring-brand ring-1 focus:ring-2"
						}`}
					/>

					{error && <p className='text-red-500 text-sm'>{error}</p>}

					<div className='flex gap-2'>
						<button
							type='button'
							onClick={handleSave}
							disabled={isPending}
							className='px-4 py-1 bg-gray-950 text-white rounded hover:bg-gray-800 transition disabled:opacity-70'
						>
							{isPending ? "Сохраняю..." : "Сохранить"}
						</button>
						<button
							type='button'
							onClick={handleCancel}
							disabled={isPending}
							className='px-4 py-1 rounded hover:bg-gray-950 hover:text-white transition disabled:opacity-70'
						>
							Отменить
						</button>
					</div>
				</div>
			) : (
				<div className='flex items-center justify-between'>
					<h1 className='text-2xl font-bold mb-4'>{title}</h1>
					<button
						type='button'
						onClick={() => setIsEditing(true)}
						className='text-sm text-gray-950 hover:text-gray-800  transition'
					>
						Изменить
					</button>
				</div>
			)}
		</div>
	);
};
