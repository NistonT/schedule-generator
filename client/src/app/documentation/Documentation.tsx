"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const Documentation = () => {
	const { back } = useRouter();

	return (
		<>
			<div>Documentation</div>
			<Link href={"#"} onClick={() => back()}>
				Вернуться...
			</Link>
		</>
	);
};
