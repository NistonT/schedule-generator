import { navigationMainPage } from "@/constants/navigation.constants";
import { ButtonMotionLink } from "../ui/buttons/ButtonMotionLink";

export const Nav = () => {
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
