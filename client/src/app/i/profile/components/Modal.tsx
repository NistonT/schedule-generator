import { AmountLimits } from "@/components/Generation/AmountLimits";
import { CabinetLimits } from "@/components/Generation/CabinetLimits";
import { Cabinets } from "@/components/Generation/Cabinets";
import { Days } from "@/components/Generation/Days";
import { Groups } from "@/components/Generation/Groups";
import { SubjectMap } from "@/components/Generation/SubjectsMap";
import { Teachers } from "@/components/Generation/Teachers";
import { TeachersMap } from "@/components/Generation/TeachersMap";
import { modalAtom } from "@/jotai/modal";
import {
	amountLimitsAtom,
	cabinetLimitsAtom,
	cabinetsAtom,
	daysAtom,
	groupsAtom,
	hoursAtom,
	maxLoadAtom,
	subjectsMapAtom,
	teachersAtom,
	teachersMapAtom,
} from "@/jotai/schedule";
import {
	TypeAmountLimits,
	TypeCabinetLimits,
	TypeTeachers,
	TypeTeachersMap,
} from "@/types/schedule.types";
import { useAtom } from "jotai";

export const Modal = () => {
	const [cabinets, setCabinets] = useAtom<string[]>(cabinetsAtom);
	const [groups, setGroups] = useAtom<string[]>(groupsAtom);
	const [teachers, setTeachers] = useAtom<TypeTeachers[]>(teachersAtom);
	const [subjectsMap, setSubjectsMap] =
		useAtom<Record<string, string[]>>(subjectsMapAtom);
	const [teachersMap, setTeachersMap] =
		useAtom<TypeTeachersMap[]>(teachersMapAtom);
	const [amountLimits, setAmountLimits] =
		useAtom<TypeAmountLimits[]>(amountLimitsAtom);
	const [cabinetLimits, setCabinetLimits] =
		useAtom<TypeCabinetLimits[]>(cabinetLimitsAtom);
	const [days, setDays] = useAtom<number>(daysAtom);
	const [maxLoad, setMaxLoad] = useAtom<number>(maxLoadAtom);
	const [hours, setHours] = useAtom<Record<string, number[]>>(hoursAtom);
	const [isModal, setIsModal] = useAtom<boolean>(modalAtom);

	const handlerIsModal = () => {
		setIsModal(!isModal);
	};

	return (
		<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
			<div className='bg-white p-6 rounded-lg shadow-lg w-full'>
				<h2 className='text-xl font-bold mb-4'>Форма обратной связи</h2>
				<div className='flex'>
					<div>
						<Cabinets />
					</div>
					<div>
						<Groups />
					</div>
					<div>
						<Teachers />
					</div>
					<div>
						<SubjectMap />
					</div>
					<div>
						<CabinetLimits />
					</div>
					<div>
						<Days />
					</div>
				</div>
				<div className='flex'></div>
				<div className='flex'>
					<div>
						<TeachersMap />
					</div>
					<div>
						<AmountLimits />
					</div>
				</div>
				{/* Кнопки */}
				<div className='flex justify-end gap-2'>
					<button
						type='button'
						className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600'
						onClick={() => handlerIsModal()}
					>
						Закрыть
					</button>
					<button
						type='submit'
						className='bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700'
					>
						Отправить
					</button>
				</div>
			</div>
		</div>
	);
};
