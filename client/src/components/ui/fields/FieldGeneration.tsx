import { ChangeEvent } from "react";

type Props = {
	label: string;
	name: string;
	value: string | number | readonly string[] | undefined;
	onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const FieldGeneration = ({ label, name, value, onChange }: Props) => {
	return (
		<>
			<div>
				<label
					htmlFor={name}
					className='block text-sm font-medium text-gray-700'
				>
					{label}
				</label>
				<input
					id={name}
					name={name}
					type='text'
					value={value}
					onChange={onChange}
					className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm'
				/>
			</div>
		</>
	);
};
