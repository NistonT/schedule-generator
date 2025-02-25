type Props = {
	label: string;
	array: string[];
};

export const OptionsCommon = ({ label, array }: Props) => {
	return (
		<>
			<option value=''>{label}</option>
			{array.map(elem => (
				<option key={elem} value={elem}>
					{elem}
				</option>
			))}
		</>
	);
};
