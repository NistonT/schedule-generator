import { TypeTeachers } from "@/types/schedule.types";

type Props = {
	label: string;
	array: TypeTeachers[];
};

export const OptionsObject = ({ label, array }: Props) => {
	return (
		<>
			<option value=''>{label}</option>
			{array?.map(elem => (
				<option key={elem.tid} value={elem.tid}>
					{elem.name}
				</option>
			))}
		</>
	);
};
