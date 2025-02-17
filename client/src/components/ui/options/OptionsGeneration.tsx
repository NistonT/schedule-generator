type Props = {
	label: string;
	array: any[];
	handleRemove: (field: string) => void;
};

export const OptionGeneration = ({ label, array, handleRemove }: Props) => {
	return (
		<>
			<option value=''>{label}</option>
			{array.map(elem => (
				<option key={elem} value={elem} onClick={() => handleRemove}>
					{elem}
				</option>
			))}
		</>
	);
};
