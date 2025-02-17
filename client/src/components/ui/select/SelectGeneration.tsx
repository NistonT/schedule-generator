import { ChangeEvent, ReactNode } from "react";

type Props = {
	label: string;
	name: string;
	children: ReactNode;
	value: string | number | readonly string[] | undefined;
	onChange: (event: ChangeEvent<any>) => void;
};

export const SelectGeneration = ({
	children,
	value,
	onChange,
	name,
	label,
}: Props) => {
	return (
		<div className='mb-4'>
			<label htmlFor={name} className='block text-sm font-medium text-gray-700'>
				{label}
			</label>
			<select
				id={name}
				value={value}
				onChange={onChange}
				className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
			>
				{children}
			</select>
		</div>
	);
};
