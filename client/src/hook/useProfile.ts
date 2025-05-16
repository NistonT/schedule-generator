import { isAuthAtom } from "@/jotai/auth";
import { userService } from "@/services/user.service";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useEffect } from "react";

export const useProfile = () => {
	const [isAuth, setIsAuth] = useAtom(isAuthAtom);

	const { data, isLoading } = useQuery({
		queryKey: ["profile"],
		queryFn: () => userService.getUserId(),
	});

	useEffect(() => {
		if (data?.data) {
			setIsAuth(true);
		} else {
			setIsAuth(false);
		}
	}, [data]);

	return { data: data?.data, isLoading, isAuth };
};
