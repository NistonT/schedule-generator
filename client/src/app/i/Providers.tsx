"use client";
import { ProfileMain } from "@/components/ProfileMain";

export default function Providers({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <ProfileMain>{children}</ProfileMain>;
}
