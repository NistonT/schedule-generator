"use client";
import { ReactNode } from "react";

type Props = {
	label: string;
	name: string;
	type: string;
	isRequired: boolean;
	errors: string | undefined | any;
	icon?: ReactNode;
	default?: string | undefined;
};

export const FieldNoRegister = ({
	label,
	type,
	name,
	isRequired = true,
	errors,
	icon,
	default: defaultValue,
}: Props) => {
	return (
		<>
			<div className='relative mb-4'>
				<label
					htmlFor={name}
					className='leading-7 text-sm text-indigo-500 select-none'
				>
					{label}
				</label>
				<div className='relative'>
					<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-indigo-500'>
						{icon}
					</div>
					<input
						type={type}
						id={name}
						className='w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 pl-10 leading-8 transition-colors duration-200 ease-in-out'
						required={isRequired}
						defaultValue={defaultValue}
					/>
				</div>

				{errors && <p className='text-red-500 text-xs mt-1'>{errors}</p>}
			</div>
		</>
	);
};
