import { GenerationId } from "./GenerationId";

type Props = {
	params: {
		id: number;
	};
};

export default function GenerationIdPage({ params: { id } }: Props) {
	return <GenerationId id={id} />;
}
