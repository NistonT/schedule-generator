import {
	IMessageHandleAdd,
	SetAtom,
	TypeTeachers,
} from "@/types/schedule.types";
import { SetStateAction, useState } from "react";
import { toast } from "sonner";

export const useHandleAddObject = (
	namesState: TypeTeachers[],
	setState: SetAtom<[SetStateAction<TypeTeachers[]>], void>,
	count: number,
	setCount: SetAtom<[SetStateAction<number>], void>,
	messageToast: IMessageHandleAdd
) => {
	const [inputValue, setInputValue] = useState("");

	const handleAdd = () => {
		const trimmedValue = inputValue.trim();
		setCount(count + 1);

		if (trimmedValue) {
			const isDuplicate = namesState.some(
				teacher => teacher.name === trimmedValue
			);
			if (isDuplicate) {
				toast.error(messageToast.messageAlready);
			} else {
				const newTeacher: TypeTeachers = {
					tid: count,
					name: trimmedValue,
				};
				console.log(newTeacher);
				setState(prev => [...prev, newTeacher]);
				setInputValue("");
				toast.success(messageToast.messageAdd);
			}
		}
	};

	const handleRemove = (teacher: TypeTeachers) => {
		setState(prev => prev.filter(t => t.tid !== teacher.tid));
		toast.success(messageToast.messageRemove + ` (${teacher.name})`);
	};

	return { handleAdd, handleRemove, inputValue, setInputValue };
};
