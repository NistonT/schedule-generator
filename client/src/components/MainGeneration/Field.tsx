"use client";

import { CircleX } from "lucide-react";
import { useState } from "react";
import { ButtonSubmit } from "../ui/buttons/ButtonSubmit";
import { DeleteField } from "./DeleteField";
import { EnumTypeField } from "./MainField";
import { PutField } from "./PutField";

type Props = {
	fieldElem: any;
	field: EnumTypeField;
};

export const Field = ({ fieldElem, field }: Props) => {
	const [isModal, setIsModal] = useState<boolean>(false);

	const handlerIsModal = () => {
		setIsModal(!isModal);
	};

	return (
		<>
			<div
				onClick={handlerIsModal}
				key={fieldElem}
				className='px-4 py-2 bg-gray-100 rounded-md text-gray-700 flex cursor-pointer'
			>
				{fieldElem}
			</div>
			{isModal && (
				<div
					onClick={handlerIsModal}
					className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'
				>
					<div
						onClick={e => e.stopPropagation()}
						className='bg-white p-6 rounded-lg'
					>
						<PutField fieldElem={fieldElem} field={field} />

						<div className='flex gap-2'>
							<DeleteField fieldElem={fieldElem} field={field} />
							<ButtonSubmit
								title={"Отмена"}
								icon={<CircleX />}
								onClick={handlerIsModal}
							/>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
