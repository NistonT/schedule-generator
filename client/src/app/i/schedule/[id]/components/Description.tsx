import { descriptionScheduleService } from "@/services/description-schedule.service";
import { IUser } from "@/types/auth.type";
import { ISchedule } from "@/types/schedule.type";
import { useMutation } from "@tanstack/react-query";
import { Check, Edit, X } from "lucide-react";
import { m } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
	schedule: ISchedule;
	profile: IUser;
};

export const Description = ({ schedule, profile }: Props) => {
	const [isChange, setIsChange] = useState<boolean>(false);
	const [description, setDescription] = useState<string>(
		!schedule?.description ? "" : schedule?.description
	);
	const [newDescription, setNewDescription] = useState<string>("");

	const handlerSetIsChange = () => {
		setIsChange(!isChange);
	};

	const { mutate } = useMutation({
		mutationKey: ["schedule_description"],
		mutationFn: () =>
			descriptionScheduleService.putDescription(
				newDescription,
				profile!.api_key,
				schedule!.id
			),
		onSuccess: () => {
			toast.success("Описание расписания изменен!");
			setDescription(newDescription);
			handlerSetIsChange();
		},
		onError: error => {
			toast.error("Не удалось сменить название расписания!");
			console.log(error);
			console.log(newDescription);
		},
	});

	useEffect(() => {
		if (schedule?.description) {
			setDescription(schedule?.description);
		}
	}, [schedule]);

	return (
		<>
			{!isChange ? (
				<m.div
					className='flex items-center gap-2'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5 }}
				>
					<textarea
						readOnly
						value={description}
						className='w-full px-4 py-3 text-base text-gray-700 bg-gray-100 border border-gray-200 rounded-lg resize-none focus:outline-none'
						rows={3}
					/>
					<button
						type='button'
						onClick={handlerSetIsChange}
						className='p-2 text-gray-500 hover:text-gray-700 transition-colors'
						aria-label='Редактировать описание'
					>
						<Edit size={20} />
					</button>
				</m.div>
			) : (
				<m.div
					variants={{
						hidden: { opacity: 0, y: 10 },
						visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
					}}
					initial='hidden'
					animate='visible'
					className='flex flex-col space-y-4'
				>
					<textarea
						value={newDescription}
						onChange={event => setNewDescription(event.target.value)}
						className='w-full px-4 py-3 text-base text-gray-700 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400'
						placeholder='Введите новое описание'
						rows={3}
					/>
					<div className='flex justify-end space-x-2'>
						<button
							type='button'
							onClick={() => mutate()}
							className='px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200 shadow-md hover:shadow-lg flex items-center gap-2'
						>
							<Check size={16} /> Сохранить
						</button>
						<button
							type='button'
							onClick={handlerSetIsChange}
							className='px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition duration-200 shadow-sm hover:shadow-md flex items-center gap-2'
						>
							<X size={16} /> Отменить
						</button>
					</div>
				</m.div>
			)}
		</>
	);
};
