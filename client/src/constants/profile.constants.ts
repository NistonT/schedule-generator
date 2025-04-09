import { DASHBOARD_PAGES } from "@/config/pages-url.config";
import {
	Book,
	Bot,
	Calendar,
	Info,
	MessageCircleQuestion,
	Settings,
	User,
} from "lucide-react";
import { ComponentType, SVGProps } from "react";

interface INavigateProfile {
	icon: ComponentType<SVGProps<SVGSVGElement>>;
	title: string;
	href: string;
	isAdmin?: boolean;
}

export const navigateProfile: INavigateProfile[] = [
	{
		icon: User,
		title: "Профиль",
		href: DASHBOARD_PAGES.PROFILE,
		isAdmin: false,
	},
	{
		icon: Bot,
		title: "Генерация",
		href: DASHBOARD_PAGES.GENERATION,
		isAdmin: false,
	},
	{
		icon: Calendar,
		title: "Расписание",
		href: DASHBOARD_PAGES.SCHEDULE,
		isAdmin: false,
	},
	{
		icon: Book,
		title: "Документация",
		href: DASHBOARD_PAGES.DOCUMENTATION,
		isAdmin: false,
	},
	{
		icon: Settings,
		title: "Настройки",
		href: DASHBOARD_PAGES.SETTING,
		isAdmin: false,
	},
	{
		icon: MessageCircleQuestion,
		title: "Обратная связь",
		href: DASHBOARD_PAGES.FEEDBACK,
		isAdmin: false,
	},
	{
		icon: User,
		title: "Админ-панель",
		href: DASHBOARD_PAGES.ADMIN_PANEL,
		isAdmin: true,
	},
	{ icon: Info, title: "О сайте", href: DASHBOARD_PAGES.ABOUT, isAdmin: false },
];
