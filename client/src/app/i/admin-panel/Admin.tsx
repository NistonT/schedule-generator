"use client";

import { DASHBOARD_PAGES } from "@/config/pages-url.config";
import { useProfile } from "@/hook/useProfile";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FeedbackList } from "./components/FeedbackList";

export const AdminPanel = () => {
	const { data: profile } = useProfile();
	const { push } = useRouter();

	useEffect(() => {
		if (profile?.role !== "ADMIN") {
			push(DASHBOARD_PAGES.AUTHORIZATION);
		}
	}, [profile]);

	return (
		<>
			<FeedbackList />
		</>
	);
};
