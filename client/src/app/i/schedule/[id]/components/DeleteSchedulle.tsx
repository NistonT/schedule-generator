"use client";
import { DASHBOARD_PAGES } from "@/config/pages-url.config";
import { scheduleService } from "@/services/schedule.service";
import { ISchedule } from "@/types/schedule.type";
import { IUser } from "@/types/user.type";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
	schedule: ISchedule;
	profile: IUser;
};

export const DeleteSchedule = ({ schedule, profile }: Props) => {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const [confirmText, setConfirmText] = useState("");
	const [error, setError] = useState("");

	const { push } = useRouter();

	const { mutate, isPending } = useMutation({
		mutationFn: () =>
			scheduleService.deleteSchedule(profile!.api_key, schedule.id),
		onSuccess: () => {
			toast.success("Расписание успешна удалена");
			setIsOpen(false);
			push(DASHBOARD_PAGES.SCHEDULE);
		},
		onError: err => {
			console.error("Ошибка при удалении расписания", err);
			setError("Неверное подтверждение");
			toast.error("Расписание успешна удалена");
		},
	});

	const handleDelete = () => {
		if (!schedule.schedule || schedule.schedule === undefined) {
			mutate();
		} else {
			// Открываем модалку
			setIsOpen(true);
		}
	};

	const handleConfirm = () => {
		const expectedText = `${schedule.title}/${profile!.username}`;
		if (confirmText.trim() !== expectedText) {
			setError("Неверное подтверждение");
			return;
		}

		mutate();
	};

	return (
		<>
			{/* Кнопка удаления */}
			<motion.button
				type='button'
				onClick={handleDelete}
				disabled={isPending}
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.98 }}
				className={`inline-flex items-center gap-2 px-3 py-1 text-sm rounded-full transition-all ${
					isPending
						? "bg-gray-100 text-gray-400 cursor-not-allowed"
						: "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700"
				}`}
			>
				<Trash2 className={`w-4 h-4 ${isPending ? "opacity-50" : ""}`} />
				{isPending ? "Удаление..." : "Удалить расписание"}
			</motion.button>

			{/* Модальное окно */}
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'
				>
					<motion.div
						initial={{ scale: 0.95, y: 10 }}
						animate={{ scale: 1, y: 0 }}
						exit={{ scale: 0.95, y: 10 }}
						className='bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4'
					>
						<h3 className='text-lg font-semibold mb-4'>
							Подтвердите удаление расписания
						</h3>
						<p className='text-gray-600 mb-4'>
							В этом расписании есть данные. Чтобы удалить его, введите:
						</p>
						<div className='mb-4'>
							<code className='block px-3 py-2 bg-gray-100 rounded border border-gray-300 text-sm'>
								{schedule.title}/{profile!.username}
							</code>
							<input
								type='text'
								value={confirmText}
								onChange={e => {
									setConfirmText(e.target.value);
									if (error) setError("");
								}}
								placeholder={`Введите "${schedule.title}/${profile!.username}"`}
								className={`mt-2 w-full px-3 py-2 border rounded ${
									error ? "border-red-500" : "border-gray-300"
								}`}
							/>
							{error && <p className='mt-1 text-red-500 text-sm'>{error}</p>}
						</div>

						<div className='flex justify-end gap-2'>
							<button
								onClick={() => setIsOpen(false)}
								disabled={isPending}
								className='px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition'
								type='button'
							>
								Отменить
							</button>
							<button
								onClick={handleConfirm}
								disabled={isPending}
								className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition'
								type='button'
							>
								{isPending ? "Удаление..." : "Подтвердить и удалить"}
							</button>
						</div>
					</motion.div>
				</motion.div>
			)}
		</>
	);
};
