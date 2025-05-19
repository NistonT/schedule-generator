import { ITypeLessons } from "../../../constants/schedule.constants";

type Props = {
	array: ITypeLessons[];
};

export const OptionsTypeLessons = ({ array }: Props) => {
	return (
		<>
			{array.map((type: ITypeLessons) => (
				<option key={type.name} value={type.value}>
					{type.name}
				</option>
			))}
		</>
	);
};
