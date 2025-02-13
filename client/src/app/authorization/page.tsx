import { NO_INDEX_PAGE } from "@/constants/seo.constants";
import { Metadata } from "next";
import { Authorization } from "./Authorization";

export const metadata: Metadata = {
	title: "Авторизация",
	...NO_INDEX_PAGE,
};

export default function AuthorizationPage() {
	return <Authorization />;
}
