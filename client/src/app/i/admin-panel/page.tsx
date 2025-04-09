import { NO_INDEX_PAGE } from "@/constants/seo.constants";
import { Metadata } from "next";
import { AdminPanel } from "./Admin";

export const metadata: Metadata = {
	title: "О сайте",
	...NO_INDEX_PAGE,
};

export default function AdminPanelPage() {
	return <AdminPanel />;
}
