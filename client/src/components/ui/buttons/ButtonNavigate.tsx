"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type Props = {
	title: string;
	href: string;
	icon?: ReactNode;
};

export const ButtonNavigate = ({ title, href, icon }: Props) => {
	const pathname = usePathname();

	return (
		<Link
			href={href}
			className={`flex items-center w-full p-4 space-x-3 text-2xl rounded-xl transition-all ${
				pathname === href
					? "text-white bg-indigo-600 shadow-md"
					: "hover:bg-indigo-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
			}`}
		>
			{icon}
			<span>{title}</span>
		</Link>
	);
};
