import { TypeTeachers } from "@/types/schedule.type";
import { ButtonGeneration } from "../../ui/buttons/ButtonGeneration";

type Props = {
	handleAddCabinetLimit: () => void;
	selectedTeacher: number | "";
	handleTeacherChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	teachers: TypeTeachers[];
	selectedCabinets: string[];
	handleCabinetsChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	cabinets: string[];
};

export const FormAddition = ({
	handleAddCabinetLimit,
	selectedTeacher,
	handleTeacherChange,
	teachers,
	selectedCabinets,
	handleCabinetsChange,
	cabinets,
}: Props) => {
	return (
		<>
			{/* Форма добавления */}
			<form
				onSubmit={e => {
					e.preventDefault();
					handleAddCabinetLimit();
				}}
				className='space-y-4'
			>
				{/* Выбор преподавателя */}
				<div>
					<label
						htmlFor='teacher-select'
						className='block text-sm font-medium text-gray-700 mb-1'
					>
						Выберите преподавателя
					</label>
					<select
						id='teacher-select'
						value={selectedTeacher}
						onChange={handleTeacherChange}
						className='w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 rounded-md shadow-sm focus:ring-2 outline-none transition-colors'
					>
						<option value=''>Выберите преподавателя</option>
						{teachers?.map(teacher => (
							<option key={teacher.tid} value={teacher.tid}>
								{teacher.name}
							</option>
						)) ?? ""}
					</select>
				</div>

				{/* Выбор кабинетов */}
				<div>
					<label
						htmlFor='cabinets-select'
						className='block text-sm font-medium text-gray-700 mb-1'
					>
						Выберите кабинеты
					</label>
					<select
						id='cabinets-select'
						multiple
						value={selectedCabinets}
						onChange={handleCabinetsChange}
						className='w-full px-3 py-2 bg-white  border border-gray-300  rounded-md shadow-sm focus:ring-2 outline-none transition-colors'
					>
						{cabinets.map(cabinet => (
							<option key={cabinet} value={cabinet}>
								{cabinet}
							</option>
						))}
					</select>
				</div>

				{/* Кнопка добавления */}
				<div className='pt-2'>
					<ButtonGeneration title='Добавить' />
				</div>
			</form>
		</>
	);
};
