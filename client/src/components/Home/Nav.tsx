import { DASHBOARD_PAGES } from "@/config/pages-url.config";
import { Book, LogIn, UserPlus } from "lucide-react";
import { ButtonLink } from "../ui/buttons/ButtonLink";

export const Nav = () => {
	return (
		<>
			<nav className='w-full max-w-4xl flex justify-between mb-8'>
				<div>
					<ButtonLink
						href={DASHBOARD_PAGES.AUTHORIZATION}
						title={"Авторизация"}
						icon={<LogIn />}
					/>
				</div>
				<div>
					<ButtonLink
						href={DASHBOARD_PAGES.REGISTRATION}
						title={"Регистрация"}
						icon={<UserPlus />}
					/>
				</div>
				<div>
					<ButtonLink
						href={DASHBOARD_PAGES.DOCUMENTATION}
						title={"Документация"}
						icon={<Book />}
					/>
				</div>
			</nav>
		</>
	);
};
