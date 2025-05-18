import { UseFormRegister } from "react-hook-form";

type Props = {
	label: string;
	name: string;
	register: UseFormRegister<any>;
	required: boolean | string;
};

export const CheckboxConfirm = ({ register, required, label, name }: Props) => {
	return (
		<div className='mb-4 flex items-center'>
			<input
				{...register(name, { required })}
				type='checkbox'
				id={name}
				className='mr-2 rounded focus:ring-indigo-200 text-gray-950'
			/>
			<label htmlFor={name} className='text-sm text-gray-600 select-none'>
				{label}
			</label>
		</div>
	);
};
