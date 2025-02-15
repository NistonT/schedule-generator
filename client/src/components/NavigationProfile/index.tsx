import { navigateProfile } from "@/constants/profile.constants";
import { ButtonNavigate } from "../ui/buttons/ButtonNavigate";

export const NavigationProfile = () => {
	return (
		<>
			<div className='w-1/5 p-5 relative ml-14' />
			<div className='w-1/5 p-5 fixed flex flex-col gap-5'>
				{navigateProfile.map(link => (
					<ButtonNavigate
						key={link.title}
						icon={<link.icon />}
						title={link.title}
						href={link.href}
					/>
				))}
			</div>
		</>
	);
};
