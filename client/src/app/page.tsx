import { DASHBOARD_PAGES } from "@/config/pages-url.config";
import Link from "next/link";

export default function Home() {
	return (
		<div>
			<Link href={DASHBOARD_PAGES.AUTHORIZATION}>Авторизация</Link>
			<Link href={DASHBOARD_PAGES.REGISTRATION}>Регистрация</Link>
		</div>
	);
}
