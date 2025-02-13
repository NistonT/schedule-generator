import { NO_INDEX_PAGE } from "@/constants/seo.constants";
import { Metadata } from "next";
import { Documentation } from "./Documentation";

export const metadata: Metadata = {
	title: "Документация",
	...NO_INDEX_PAGE,
};

export default function DocumentationPage() {
	return <Documentation />;
}
