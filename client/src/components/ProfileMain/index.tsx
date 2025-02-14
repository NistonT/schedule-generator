"use client";

import { NavigationProfile } from "@/components/NavigationProfile";
import { ButtonSubmit } from "@/components/ui/buttons/ButtonSubmit";
import { DASHBOARD_PAGES } from "@/config/pages-url.config";
import { useProfile } from "@/hook/useProfile";
import { isAuthAtom } from "@/jotai/auth";
import { authService } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { LogOut, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { toast } from "sonner";
import { Loading } from "../Loading";

type Props = {
	children?: ReactNode;
};

export const ProfileMain = ({ children }: Props) => {
	const { push } = useRouter();
	const [isAuth, setIsAuth] = useAtom(isAuthAtom);

	const { mutate } = useMutation({
		mutationKey: ["logout"],
		mutationFn: () => authService.logout(),
		onSuccess: () => {
			toast("Вы вышли из профиля!");
			setIsAuth(false);
			push(DASHBOARD_PAGES.HOME);
			location.reload();
		},
	});

	const onLogout = () => {
		mutate();
	};

	const { data, isLoading } = useProfile();

	if (isLoading) {
		return <Loading />;
	}

	return (
		<>
			{isAuth ? (
				<>
					<div className='flex container mx-auto w-full justify-end items-center gap-4 p-4 bg-white'>
						<div className='text-gray-700 flex items-center gap-1'>
							<User className='w-5 h-5' /> {data?.username}
						</div>

						<div className='text-gray-500 flex items-center gap-1'>
							<Mail className='w-5 h-5' />
							{data?.email}
						</div>

						<div onClick={onLogout} className='cursor-pointer'>
							<ButtonSubmit
								title='Выйти'
								icon={<LogOut className='w-5 h-5' />}
							/>
						</div>
					</div>
					<div className='bg-white container mx-auto w-full flex relative mt-10'>
						<NavigationProfile />
						<div className='w-4/5 p-5'>{children}</div>
					</div>
				</>
			) : (
				<div>{children}</div>
			)}
		</>
	);
};
