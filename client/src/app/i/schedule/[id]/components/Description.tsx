import { descriptionScheduleService } from "@/services/description-schedule.service";
import { ISchedule } from "@/types/schedule.type";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
	schedule: ISchedule;
	apiKey: string;
};

export const Description = ({ schedule, apiKey }: Props) => {
	const [isEditing, setIsEditing] = useState(false);
	const [description, setDescription] = useState(schedule.description || "");
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setDescription(schedule.description || "");
	}, [schedule.description]);

	const { mutate, isPending } = useMutation({
		mutationKey: ["update_description"],
		mutationFn: () =>
			descriptionScheduleService.addDescription(
				description,
				apiKey,
				schedule.id
			),
		onSuccess: updatedSchedule => {
			setDescription(updatedSchedule.data.description);
			setIsEditing(false);
			toast.success("Описание успешно изменено");
		},
		onError: (err: Error) => {
			toast.error(err.message || "Ошибка при сохранении описания");
		},
	});

	const handleSave = () => {
		const trimmedDescription = description.replace(/\s+/g, "");
		if (trimmedDescription.length < 6) {
			setError("Описание должно содержать минимум 6 символов");
			return;
		}

		setError(null);
		mutate(); // отправка на сервер
	};

	const handleCancel = () => {
		setDescription(schedule.description || "");
		setError(null);
		setIsEditing(false);
	};

	return (
		<div className='mb-6'>
			{isEditing ? (
				<div className='space-y-3'>
					<textarea
						value={description}
						onChange={e => setDescription(e.target.value)}
						placeholder='Введите новое описание'
						rows={4}
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
					<p className='text-gray-700 mb-2'>{description}</p>
					<button
						type='button'
						onClick={() => setIsEditing(true)}
						className='text-sm text-gray-950 hover:text-gray-800 transition'
					>
						Изменить
					</button>
				</div>
			)}
		</div>
	);
};
