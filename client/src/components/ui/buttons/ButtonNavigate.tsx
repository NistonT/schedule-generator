"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type Props = {
	title: string;
	href: string;
	icon: ReactNode;
};

export const ButtonNavigate = ({ title, href, icon }: Props) => {
	const pathname = usePathname();
	return (
		<Link
			href={href}
			className={`flex items-center w-full p-4 space-x-3 text-lg rounded-xl transition-all ${
				pathname === href
					? "text-white bg-gray-950 shadow-md"
					: "hover:text-white hover:bg-gray-950 hover:shadow-md"
			}`}
		>
			{icon}
			<span>{title}</span>
		</Link>
	);
};
