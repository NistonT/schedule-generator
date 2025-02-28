import { DASHBOARD_PAGES } from "@/config/pages-url.config";
import { Book, LogIn, UserPlus } from "lucide-react";
import { ReactNode } from "react";
import { ButtonMotionLink } from "../ui/buttons/ButtonMotionLink";

interface INavigationMainPage {
	href: string;
	title: string;
	icon?: ReactNode;
	target?: string;
	className?: string;
	indexButton?: number;
}

export const Nav = () => {
	const navigationMainPage: INavigationMainPage[] = [
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

	return (
		<>
			<nav className='w-full max-w-4xl flex justify-between mb-8'>
				{navigationMainPage.map((link, index) => (
					<div>
						<ButtonMotionLink
							icon={link.icon}
							href={link.href}
							title={link.title}
							indexButton={index}
						/>
					</div>
				))}
			</nav>
		</>
	);
};
