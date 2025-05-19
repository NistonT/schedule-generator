import { ScheduleId } from "./ScheduleId";

interface Props {
	params: {
		id: string;
	};
}

export default function ScheduleIdPage({ params: { id } }: Props) {
	return <ScheduleId id={id} />;
}
