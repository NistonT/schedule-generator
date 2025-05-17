"use client";
import { ButtonSubmit } from "@/components/ui/buttons/ButtonSubmit";
import { userService } from "@/services/user.service";
import { IUser } from "@/types/user.type";
import { maskApiKey } from "@/utils/apiKey";
import { useMutation } from "@tanstack/react-query";
import { Copy, Key, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

type Props = {
	data: IUser | undefined;
};

export const ApiForm = ({ data }: Props) => {
	const { mutate } = useMutation({
		mutationKey: ["update-key-api"],
		mutationFn: () => userService.updateApi(),
		onSuccess: () => {
			toast("Ключ api обновился успешно!");
			location.reload();
		},
		onError: error => {
			toast(error.message);
		},
	});

	const handlerRefreshKeyApi = () => {
		mutate();
	};

	const handlerCopyKeyApi = () => {
		if (data?.api_key === undefined) {
			toast("Ключ api не обнаружен");
			return;
		}

		navigator.clipboard.writeText(data?.api_key);
		toast("Вы скопировали ключ api");
	};

	return (
		<div className='bg-white rounded-lg p-6 mb-6'>
			<h2 className='text-xl font-semibold text-gray-700 mb-6 border-b pb-2'>
				<div className='flex items-center gap-1'>
					<Key />
					<span>API ключ</span>
				</div>
			</h2>
			<div>
				<label className='block text-sm font-medium text-gray-500'>
					Ваш API ключ
				</label>
				<p className='mt-1 text-lg text-gray-900 break-all bg-gray-50 p-3 rounded-md'>
					{maskApiKey(data?.api_key)}
				</p>
				<div className='flex gap-4 mt-4'>
					<span onClick={handlerRefreshKeyApi} className='w-full'>
						<ButtonSubmit title={"Обновить"} icon={<RefreshCcw />} />
					</span>
					<span className='w-full' onClick={handlerCopyKeyApi}>
						<ButtonSubmit title={"Скопировать"} icon={<Copy />} />
					</span>
				</div>
			</div>
		</div>
	);
};
