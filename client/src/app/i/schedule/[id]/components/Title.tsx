import { titleScheduleService } from "@/services/title-schedule.service";
import { IUser } from "@/types/auth.types";
import { ISchedule } from "@/types/schedule.types";
import { useMutation } from "@tanstack/react-query";
import { Check, Edit, X } from "lucide-react";
import { m } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
	schedule: ISchedule;
	profile: IUser;
};

export const Title = ({ schedule, profile }: Props) => {
	const [isChange, setIsChange] = useState<boolean>(false);
	const [newTitle, setNewTitle] = useState<string>("");
	const [title, setTitle] = useState<string>(
		!schedule?.title ? "" : schedule?.title
	);

	const handlerSetIsChange = () => {
		setIsChange(!isChange);
	};

	const { mutate } = useMutation({
		mutationKey: ["schedule_title"],
		mutationFn: () =>
			titleScheduleService.putTitle(newTitle, profile.api_key, schedule!.id),
		onSuccess: () => {
			toast.success("Название расписания изменен!");
			setTitle(newTitle);
			handlerSetIsChange();
		},
		onError: error => {
			toast.error("Не удалось сменить название расписания!");
		},
	});

	useEffect(() => {
		if (schedule?.title) {
			setTitle(schedule?.title);
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
					<h3 className='text-2xl font-bold text-gray-900'>{title}</h3>
					<button
						type='button'
						onClick={handlerSetIsChange}
						className='p-2 text-gray-500 hover:text-gray-700 transition-colors'
						aria-label='Редактировать заголовок'
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
					<input
						type='text'
						value={newTitle}
						onChange={event => setNewTitle(event.target.value)}
						className='px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400'
						placeholder='Введите новый заголовок'
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
