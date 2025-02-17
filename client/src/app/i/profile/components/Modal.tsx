"use client";
import { AmountLimits } from "@/components/Generation/AmountLimits";
import { CabinetLimits } from "@/components/Generation/CabinetLimits";
import { Cabinets } from "@/components/Generation/Cabinets";
import { Days } from "@/components/Generation/Days";
import { Groups } from "@/components/Generation/Groups";
import { Hours } from "@/components/Generation/Hours";
import { MaxLoad } from "@/components/Generation/MaxLoad";
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
import { useAtom } from "jotai";

export const Modal = () => {
	const [cabinets, setCabinets] = useAtom(cabinetsAtom);
	const [groups, setGroups] = useAtom(groupsAtom);
	const [teachers, setTeachers] = useAtom(teachersAtom);
	const [subjectsMap, setSubjectsMap] = useAtom(subjectsMapAtom);
	const [teachersMap, setTeachersMap] = useAtom(teachersMapAtom);
	const [amountLimits, setAmountLimits] = useAtom(amountLimitsAtom);
	const [cabinetLimits, setCabinetLimits] = useAtom(cabinetLimitsAtom);
	const [days, setDays] = useAtom(daysAtom);
	const [maxLoad, setMaxLoad] = useAtom(maxLoadAtom);
	const [hours, setHours] = useAtom(hoursAtom);
	const [isModal, setIsModal] = useAtom(modalAtom);

	const handlerIsModal = () => {
		setIsModal(!isModal);
	};

	return (
		<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
			<div className='bg-white p-6 rounded-lg shadow-lg w-full h-[90vh] max-w-[95vw] flex flex-col overflow-hidden'>
				<h2 className='text-xl font-bold mb-4'>Форма генерации</h2>
				<div className='flex-1 overflow-y-auto pr-4'>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{/* Секция 1: Кабинеты, Группы, Преподаватели */}
						<div className='space-y-6'>
							<Cabinets />
							<Groups />
							<Teachers />
						</div>

						{/* Секция 2: Предметы, Ограничения кабинетов, Дни */}
						<div className='space-y-6'>
							<SubjectMap />
							<CabinetLimits />
							<Days />
						</div>

						{/* Секция 3: Максимальная нагрузка, Часы, Преподаватели и ограничения */}
						<div className='space-y-6'>
							<MaxLoad />
							<Hours />
							<TeachersMap />
							<AmountLimits />
						</div>
					</div>
				</div>
				{/* Кнопки */}
				<div className='flex justify-end gap-2 mt-4'>
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
