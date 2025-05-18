import { ChangeEvent, useCallback } from "react";

type Props = {
	label: string;
	name: string;
	value: string;
	onChange: (value: string) => void;
	className?: string;
};

const formatDateInput = (input: string): string => {
	const digits = input.replace(/\D/g, "");
	if (digits.length <= 4) return digits;
	if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
	return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
};

export const FieldDate = ({
	label,
	name,
	value,
	onChange,
	className = "",
}: Props) => {
	const handleChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			onChange(formatDateInput(e.target.value));
		},
		[onChange]
	);

	return (
		<div className={className}>
			<label
				htmlFor={name}
				className='block text-sm font-medium text-gray-700 mb-1'
			>
				{label}
			</label>
			<input
				id={name}
				name={name}
				type='text'
				value={value}
				onChange={handleChange}
				placeholder='YYYY-MM-DD'
				maxLength={10}
				className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm'
			/>
		</div>
	);
};
