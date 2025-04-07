import { ScheduleId } from "./ScheeduleId";

interface Props {
	params: {
		id: number;
	};
}

export default function ScheduleIdPage({ params: { id } }: Props) {
	return <ScheduleId id={id} />;
}
