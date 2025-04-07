import { IScheduleGetList } from "@/types/schedule.types";
import { CabinetSchedule } from "./components/CabinetSchedule";
import { GroupSchedule } from "./components/GroupSchedule";
import { HeaderSchedule } from "./components/HeaderSchedule";
import { TeacherSchedule } from "./components/TeacherSchedule";
import { ScheduleDays } from "./ScheduleDays";

type Props = {
	schedules: IScheduleGetList[] | null;
	isShow: boolean;
};

export const ScheduleFull = ({ schedules, isShow }: Props) => {
	return (
		<>
			{schedules && (
				<div className='space-y-8'>
					{schedules.map(schedule => (
						<div
							key={schedule.id}
							className='bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg'
						>
							{/* Заголовок расписания */}
							<div className='p-6 border-b border-gray-200'>
								<HeaderSchedule title={schedule.title} id={schedule.id} />

								<div className='flex flex-wrap gap-4 mt-4'>
									{/* Группы */}
									<GroupSchedule groups={schedule.groups} />

									{/* Преподаватели */}
									<TeacherSchedule teachers={schedule.teachers} />

									{/* Кабинеты */}
									<CabinetSchedule cabinets={schedule.cabinets} />
								</div>
							</div>

							{/* Расписание по дням */}
							<div className='p-6'>
								{isShow && <ScheduleDays schedule={schedule} />}
							</div>
						</div>
					))}
				</div>
			)}
		</>
	);
};
