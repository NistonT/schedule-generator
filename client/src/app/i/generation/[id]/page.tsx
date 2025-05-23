import { GenerationId } from "./GenerationId";

type Props = {
	params: {
		id: string;
	};
};

export default function GenerationIdPage({ params: { id } }: Props) {
	return <GenerationId id={id} />;
}
