interface Props {
	params: {
		id: number;
	};
}

export default function ScheduleIdPage({ params: { id } }: Props) {
	return <div>{id}</div>;
}
