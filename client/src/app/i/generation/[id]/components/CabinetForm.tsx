import { cabinetsAtom } from "@/jotai/schedule";
import { IAddCabinet } from "@/types/cabinet.type";
import { ISchedule } from "@/types/schedule.type";
import { IUser } from "@/types/user.type";
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";

type Props = {
	profile: IUser;
	schedule: ISchedule;
	onCabinetAdded: (newCabinets: string[]) => void;
};

export const CabinetForm = ({ profile, schedule, onCabinetAdded }: Props) => {
	const [cabinets, setCabinets] = useAtom(cabinetsAtom);

	const { register, handleSubmit, reset } = useForm<IAddCabinet>();

	return (
		<form className='space-y-4'>
			<div>
				<label
					htmlFor='name'
					className='block text-sm font-medium text-gray-700'
				>
					Название кабинетов
				</label>
				<input
					id='name'
					{...register("name", { required: true })}
					className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
					placeholder='Введите названия через пробел'
				/>
			</div>

			<button
				type='submit'
				className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
			>
				Добавить
			</button>
		</form>
	);
};
