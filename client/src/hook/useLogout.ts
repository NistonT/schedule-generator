import { DASHBOARD_PAGES } from "@/config/pages-url.config";
import { isAdminAtom, isAuthAtom } from "@/jotai/auth";
import { profileDataAtom } from "@/jotai/profile";
import { authService } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { useAtom, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { useProfile } from "./useProfile";

export const useLogout = () => {
	const { data, isLoading } = useProfile();

	const { push } = useRouter();
	const setProfile = useSetAtom(profileDataAtom);
	const [isAuth, setIsAuth] = useAtom(isAuthAtom);
	const [isAdmin, setIsAdmin] = useAtom(isAdminAtom);

	const { mutate } = useMutation({
		mutationKey: ["logout"],
		mutationFn: () => authService.logout(),
		onSuccess: () => {
			toast("Вы вышли из профиля!");
			setProfile(null);
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
		if (data) {
			setProfile(data);
		}
	}, [data]);

	return { onLogout };
};
