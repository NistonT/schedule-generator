import { IMessageHandleAdd } from "@/types/schedule.types";

export const messageCabinets: IMessageHandleAdd = {
	messageAdd: "Кабинет добавлен",
	messageAlready: "Кабинет уже добавлен",
	messageRemove: "Кабинет удален",
};

export const messageGroups: IMessageHandleAdd = {
	messageAdd: "Группа добавлена",
	messageAlready: "Группа уже добавлена",
	messageRemove: "Группа удалена",
};

export const messageTeachers: IMessageHandleAdd = {
	messageAdd: "Преподаватель добавлен!",
	messageAlready: "Преподаватель уже добавлен!",
	messageRemove: "`Преподаватель удален!`",
};
