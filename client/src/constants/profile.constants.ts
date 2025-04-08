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
}

export const navigateProfile: INavigateProfile[] = [
	{ icon: User, title: "Профиль", href: DASHBOARD_PAGES.PROFILE },
	{ icon: Bot, title: "Генерация", href: DASHBOARD_PAGES.GENERATION },
	{ icon: Calendar, title: "Расписание", href: DASHBOARD_PAGES.SCHEDULE },
	{ icon: Book, title: "Документация", href: DASHBOARD_PAGES.DOCUMENTATION },
	{ icon: Settings, title: "Настройки", href: DASHBOARD_PAGES.SETTING },
	{
		icon: MessageCircleQuestion,
		title: "Обратная связь",
		href: DASHBOARD_PAGES.FEEDBACK,
	},
	{ icon: Info, title: "О сайте", href: DASHBOARD_PAGES.ABOUT },
];
