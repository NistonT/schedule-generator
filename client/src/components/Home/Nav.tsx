import { DASHBOARD_PAGES } from "@/config/pages-url.config";
import { ButtonLink } from "../ui/buttons/ButtonLink";

export const Nav = () => {
	return (
		<>
			<nav className='w-full max-w-4xl flex justify-between mb-8'>
				<ButtonLink
					href={DASHBOARD_PAGES.AUTHORIZATION}
					title={"Авторизация"}
				/>
				<ButtonLink href={DASHBOARD_PAGES.REGISTRATION} title={"Регистрация"} />
			</nav>
		</>
	);
};
