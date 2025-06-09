import { ISchedule } from "@/types/schedule.type";

type Props = {
	schedule: ISchedule;
	apiKey: string;
};

export const IsShow = ({ schedule, apiKey }: Props) => {
	return (
		<>
			<div className='flex justify-between items-center mb-4'>
				<span
					className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
						schedule.isShow
							? "bg-gray-100 text-gray-800"
							: "bg-gray-100 text-gray-800"
					}`}
				>
					{schedule.isShow ? "Активна" : "Скрыто"}
				</span>
			</div>
		</>
	);
};
