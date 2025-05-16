"use client";
import { CabinetLimits } from "@/components/Generation/CabinetLimits";
import { Cabinets } from "@/components/Generation/Cabinets";
import { Days } from "@/components/Generation/Days";
import { Groups } from "@/components/Generation/Groups";
import { MaxLoad } from "@/components/Generation/MaxLoad";
import { MultiSubject } from "@/components/Generation/MultiSubject";
import { Teachers } from "@/components/Generation/Teachers";
import { useProfile } from "@/hook/useProfile";
import { modalAtom } from "@/jotai/modal";
import {
	amountLimitsAtom,
	cabinetLimitsAtom,
	cabinetsAtom,
	daysAtom,
	generationCurrentScheduleFormAtom,
	groupsAtom,
	maxLoadAtom,
	subjectsMapAtom,
	teachersAtom,
	teachersMapAtom,
} from "@/jotai/schedule";
import { TypeScheduleForm } from "@/types/schedule.type";
import { useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";
import { toast } from "sonner";
import { AllSchedule } from "./AllSchedule";
import { CreateSchedule } from "./CreateSchedule";
import { GenerationSchedule } from "./GenerationSchedule";

export const Modal = () => {
	const setGenerationCurrentScheduleForm = useSetAtom(
		generationCurrentScheduleFormAtom
	);

	const [cabinets, setCabinets] = useAtom(cabinetsAtom);
	const [groups, setGroups] = useAtom(groupsAtom);
	const [teachers, setTeachers] = useAtom(teachersAtom);
	const [subjectsMap, setSubjectsMap] = useAtom(subjectsMapAtom);
	const [teachersMap, setTeachersMap] = useAtom(teachersMapAtom);
	const [amountLimits, setAmountLimits] = useAtom(amountLimitsAtom);
	const [cabinetLimits, setCabinetLimits] = useAtom(cabinetLimitsAtom);
	const [days, setDays] = useAtom(daysAtom);
	const [maxLoad, setMaxLoad] = useAtom(maxLoadAtom);
	const [isModal, setIsModal] = useAtom(modalAtom);

	const handlerIsModal = () => {
		setIsModal(!isModal);
	};

	const { data } = useProfile();

	useEffect(() => {
		const schedule: TypeScheduleForm = {
			cabinets,
			groups,
			teachers: teachers?.map(teacher => ({
				tid: teacher.tid,
				name: teacher.name,
			})),
			subjectsMap,
			teachersMap,
			amountLimits,
			cabinetLimits,
			days,
			maxLoad,
		};

		console.log("Отправляемые данные:", JSON.stringify(schedule, null, 2));

		if (!data) {
			toast.error("Данные пользователя отсутствуют!");
			return;
		}

		setGenerationCurrentScheduleForm(schedule);
	}, [
		cabinets,
		groups,
		teachers,
		subjectsMap,
		teachersMap,
		amountLimits,
		cabinetLimits,
		days,
		maxLoad,
	]);

	return (
		<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
			<div className='bg-white p-6 rounded-lg shadow-lg w-full h-[90vh] max-w-[95vw] flex flex-col overflow-hidden'>
				<h2 className='text-xl font-bold mb-4'>Форма генерации</h2>
				<div className='flex-1 overflow-y-auto pr-4'>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						<div className='space-y-6'>
							<Cabinets />
							<Groups />
							<Teachers />
						</div>
						<div className='space-y-6'>
							<MaxLoad />
							<CabinetLimits />
							<Days />
						</div>

						<div className='space-y-6'>
							<MultiSubject />
						</div>
					</div>
					<div>
						<AllSchedule />
					</div>
				</div>
				<div className='flex justify-end gap-2 mt-4'>
					<a
						href={`http://localhost:5555/api/schedule/generate?api-key=${data?.api_key}`}
						target='_blank'
					>
						Перейти к расписанию
					</a>

					<button
						type='button'
						className='bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600'
						onClick={() => handlerIsModal()}
					>
						Закрыть
					</button>
					<GenerationSchedule />
					<CreateSchedule />
				</div>
			</div>
		</div>
	);
};
