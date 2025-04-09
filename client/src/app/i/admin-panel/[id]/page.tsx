import { FeedbackId } from "./FeedbackId";

interface Props {
	params: {
		id: number;
	};
}

export default function FeedbackIdPage({ params: { id } }: Props) {
	return <FeedbackId id={id} />;
}
