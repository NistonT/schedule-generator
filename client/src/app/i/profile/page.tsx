"use client";
import { DASHBOARD_PAGES } from "@/config/pages-url.config";
import { authService } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ProfilePage() {
	const { push } = useRouter();

	const { mutate } = useMutation({
		mutationKey: ["logout"],
		mutationFn: () => authService.logout(),
		onSuccess: () => {
			toast("Вы вышли из профиля!");
			push(DASHBOARD_PAGES.HOME);
		},
	});

	const onLogout = () => {
		mutate();
	};

	return (
		<div>
			profile
			<button type='button' onClick={onLogout}>
				logout
			</button>
		</div>
	);
}
