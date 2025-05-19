"use client";

import {
	ButtonSubmit,
	EnumTypeButton,
} from "@/components/ui/buttons/ButtonSubmit";
import { navigateProfile } from "@/constants/profile.constants";
import { useLogout } from "@/hook/useLogout";
import { useProfile } from "@/hook/useProfile";
import { isAdminAtom, isAuthAtom } from "@/jotai/auth";
import { useAtom } from "jotai";
import { LogOut, Mail, ShieldCheck, User } from "lucide-react";
import { m } from "motion/react";
import { ReactNode, useState } from "react";
import { Loading } from "../Loading";
import { ButtonNavigate } from "../ui/buttons/ButtonNavigate";

type Props = {
	children?: ReactNode;
};

export const ProfileMain = ({ children }: Props) => {
	const { data, isLoading } = useProfile();
	const [isAuth, setIsAuth] = useAtom(isAuthAtom);
	const [isAdmin, setIsAdmin] = useAtom(isAdminAtom);

	const [selectedTab, setSelectedTab] = useState(navigateProfile[0]);

	const { onLogout } = useLogout();

	if (isLoading) {
		return <Loading />;
	}

	return (
		<>
			{isAuth ? (
				<>
					<m.div
						initial={{
							y: -40,
							opacity: 0,
						}}
						whileInView={{
							y: 0,
							opacity: 1,
						}}
						viewport={{ once: false }}
						transition={{
							duration: 1,
						}}
						className='flex mx-auto w-full justify-end items-center gap-4 p-4 bg-transparent relative z-30'
					>
						{isAdmin && (
							<m.div
								variants={{
									hidden: { opacity: 0, y: -20 },
									visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
								}}
								initial='hidden'
								animate='visible'
								className='flex items-center gap-2 bg-gray-950 text-white px-4 py-2 rounded-md shadow-lg max-w-fit select-none'
							>
								{/* Иконка */}
								<ShieldCheck size={20} className='text-white' />

								{/* Текст */}
								<span className='font-medium'>ADMIN ROLE</span>
							</m.div>
						)}
						<m.div className='text-gray-700 flex items-center gap-1'>
							<User className='w-5 h-5' /> {data?.username}
						</m.div>

						<m.div className='text-gray-500 flex items-center gap-1'>
							<Mail className='w-5 h-5' />
							{data?.email}
						</m.div>

						<m.div>
							<ButtonSubmit
								onClick={onLogout}
								title='Выйти'
								icon={<LogOut className='w-5 h-5' />}
								type={EnumTypeButton.BUTTON}
							/>
						</m.div>
					</m.div>
					<div className='mx-auto w-full flex relative mt-5'>
						<div className='w-1/5 p-5 relative ml-14' />
						<div className='w-1/5 p-5 fixed flex flex-col gap-5'>
							{navigateProfile
								.filter(link => !link.isAdmin || isAdmin)
								.map(link => (
									<m.div key={link.title}>
										<ButtonNavigate
											key={link.title}
											icon={<link.icon />}
											title={link.title}
											href={link.href}
										/>
									</m.div>
								))}
						</div>
						<div className='w-4/5 p-5'>{children}</div>
					</div>
				</>
			) : (
				<div>{children}</div>
			)}
		</>
	);
};
