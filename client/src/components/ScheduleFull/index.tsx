import { IScheduleGetList } from "@/types/schedule.type";
import { m } from "motion/react";
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
					{schedules.map((schedule, index) => (
						<m.div
							key={schedule.id}
							variants={{
								hidden: { opacity: 0, y: 20 },
								visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
							}}
							initial='hidden'
							animate='visible'
							className='bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg'
						>
							{/* Заголовок расписания */}
							<div className='p-6 border-b border-gray-200'>
								<HeaderSchedule
									title={schedule.title}
									id={schedule.id}
									index={index}
								/>

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
							<m.div
								className='p-6 overflow-hidden'
								initial={{ height: 0 }}
								animate={{ height: isShow ? "auto" : 0 }}
								transition={{ duration: 0.3 }}
							>
								{isShow && <ScheduleDays schedule={schedule} />}
							</m.div>
						</m.div>
					))}
				</div>
			)}
		</>
	);
};
