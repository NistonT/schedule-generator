"use client";

import { ProfileMain } from "@/components/ProfileMain";
import { useProfile } from "@/hook/useProfile";
export const Profile = () => {
	const { isLoading } = useProfile();

	return (
		<>
			<ProfileMain>Generation</ProfileMain>
		</>
	);
};
