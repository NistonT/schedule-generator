"use client";
import { ProfileMain } from "@/components/ProfileMain";
import { useProfile } from "@/hook/useProfile";

export default function Providers({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { isAuth } = useProfile();

	return (
		<>
			{isAuth ? <ProfileMain>{children}</ProfileMain> : <div>{children}</div>}
		</>
	);
}
