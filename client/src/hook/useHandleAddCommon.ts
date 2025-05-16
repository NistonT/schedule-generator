import { IMessageHandleAdd, SetAtom } from "@/types/schedule.type";
import { SetStateAction, useState } from "react";
import { toast } from "sonner";

export const useHandleAddCommon = (
	namesState: string[],
	setNamesState: SetAtom<[SetStateAction<string[]>], void>,
	messageToast: IMessageHandleAdd
) => {
	const [inputValue, setInputValue] = useState<string>("");

	const handleAdd = () => {
		const trimmedValue = inputValue.trim();
		if (trimmedValue) {
			if (namesState.includes(trimmedValue)) {
				toast.error(messageToast.messageAlready);
			} else {
				setNamesState(prev => [...prev, trimmedValue]);
				setInputValue("");
				toast.success(messageToast.messageAdd);
			}
		}
	};

	const handleRemove = (elem: string) => {
		setNamesState(prev => prev.filter(e => e !== elem));
		toast.success(messageToast.messageRemove + ` (${elem})`);
	};

	return { handleAdd, handleRemove, inputValue, setInputValue };
};
