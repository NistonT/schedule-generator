import { OptionsCommon } from "../options/OptionsCommon";
import { OptionsObject } from "../options/OptionsObject";
import { OptionsTypeLessons } from "../options/OptionsTypeLessons";

export enum EnumTypeArray {
	COMMON = "common",
	TYPE = "type",
	OBJECT = "object",
}

type Props = {
	label: string;
	id: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	array: string[] | any;
	type?: EnumTypeArray;
};

export const SelectMultiSubject = ({
	label,
	id,
	value,
	onChange,
	array,
	type = EnumTypeArray.COMMON,
}: Props) => {
	return (
		<div className='mb-4'>
			<label
				htmlFor={`${id}-select`}
				className='block text-sm font-medium text-gray-700'
			>
				{label}
			</label>
			<select
				id={`${id}-select`}
				value={value}
				onChange={onChange}
				className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
			>
				{type === EnumTypeArray.COMMON && (
					<OptionsCommon label={label} array={array} />
				)}
				{type === EnumTypeArray.OBJECT && (
					<OptionsObject label={label} array={array} />
				)}
				{type === EnumTypeArray.TYPE && <OptionsTypeLessons array={array} />}
			</select>
		</div>
	);
};
