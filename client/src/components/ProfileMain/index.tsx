"use client";

import {
	ButtonSubmit,
	EnumTypeButton,
} from "@/components/ui/buttons/ButtonSubmit";
import { DASHBOARD_PAGES } from "@/config/pages-url.config";
import { navigateProfile } from "@/constants/profile.constants";
import { useProfile } from "@/hook/useProfile";
import { isAdminAtom, isAuthAtom } from "@/jotai/auth";
import { authService } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { LogOut, Mail, User } from "lucide-react";
import { LayoutGroup, m } from "motion/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { Loading } from "../Loading";
import { ButtonNavigate } from "../ui/buttons/ButtonNavigate";

type Props = {
	children?: ReactNode;
};

export const ProfileMain = ({ children }: Props) => {
	const { data, isLoading } = useProfile();
	const { push } = useRouter();
	const [isAuth, setIsAuth] = useAtom(isAuthAtom);
	const [isAdmin, setIsAdmin] = useAtom(isAdminAtom);

	const { mutate } = useMutation({
		mutationKey: ["logout"],
		mutationFn: () => authService.logout(),
		onSuccess: () => {
			toast("Вы вышли из профиля!");
			setIsAuth(false);
			setIsAdmin(false);
			push(DASHBOARD_PAGES.HOME);
			location.reload();
		},
	});

	const onLogout = () => {
		mutate();
	};

	useEffect(() => {
		if (data?.role === "ADMIN") {
			setIsAdmin(true);
		}
		console.log(data);
	}, [data]);

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
						{isAdmin && <div>ADMIN ROLE</div>}
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
					<div className='mx-auto w-full flex relative mt-10'>
						<div className='w-1/5 p-5 relative ml-14' />
						<div className='w-1/5 p-5 fixed flex flex-col gap-5'>
							<LayoutGroup>
								{/* Фильтруем ссылки в зависимости от роли пользователя */}
								{navigateProfile
									.filter(link => !link.isAdmin || isAdmin) // Показываем ссылку, если она не админская или пользователь админ
									.map(link => (
										<m.div layout key={link.title}>
											<ButtonNavigate
												key={link.title}
												icon={<link.icon />}
												title={link.title}
												href={link.href}
											/>
										</m.div>
									))}
							</LayoutGroup>
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
