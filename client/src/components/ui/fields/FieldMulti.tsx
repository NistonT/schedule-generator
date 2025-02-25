type Props = {
	label: string;
	id: string;
	value: string | number;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const FieldMulti = ({ label, id, value, onChange }: Props) => {
	return (
		<div className='mb-4'>
			<label
				htmlFor={`${id}-input`}
				className='block text-sm font-medium text-gray-700'
			>
				{label}
			</label>
			<input
				id={`${id}-input`}
				type='number'
				value={value}
				onChange={onChange}
				className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
				min={0}
				style={{
					WebkitAppearance: "none",
					MozAppearance: "textfield",
				}}
			/>
		</div>
	);
};
