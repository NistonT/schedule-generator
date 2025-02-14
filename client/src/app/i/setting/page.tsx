import { NO_INDEX_PAGE } from "@/constants/seo.constants";
import { Metadata } from "next";
import { Setting } from "./Setting";

export const metadata: Metadata = {
	title: "Настройки",
	...NO_INDEX_PAGE,
};

export default function SettingPage() {
	return <Setting />;
}
