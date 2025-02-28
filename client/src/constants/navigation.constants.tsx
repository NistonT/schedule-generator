import { DASHBOARD_PAGES } from "@/config/pages-url.config";
import { Book, LogIn, UserPlus } from "lucide-react";
import { ReactNode } from "react";

export interface INavigationMainPage {
	href: string;
	title: string;
	icon?: ReactNode;
	target?: string;
	className?: string;
	indexButton?: number;
}

export const navigationMainPage: INavigationMainPage[] = [
	{
		href: DASHBOARD_PAGES.AUTHORIZATION,
		title: "Авторизация",
		icon: <LogIn />,
	},
	{
		href: DASHBOARD_PAGES.DOCUMENTATION,
		title: "Документация",
		icon: <Book />,
	},
	{
		href: DASHBOARD_PAGES.REGISTRATION,
		title: "Регистрация",
		icon: <UserPlus />,
	},
];
