import { Calendar } from "lucide-react";

type Props = {
	day: string;
};

export const DayCalendar = ({ day }: Props) => {
	return (
		<h3 className='text-lg font-medium flex items-center gap-2 text-gray-800'>
			<Calendar size={18} className='text-gray-500' /> {day}
		</h3>
	);
};
