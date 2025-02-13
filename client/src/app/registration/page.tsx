import { NO_INDEX_PAGE } from "@/constants/seo.constants";
import { Metadata } from "next";
import { Registration } from "./Registration";

export const metadata: Metadata = {
	title: "Регистрация",
	...NO_INDEX_PAGE,
};

export default function RegistrationPage() {
	return <Registration />;
}
