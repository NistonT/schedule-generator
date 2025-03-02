import { NO_INDEX_PAGE } from "@/constants/seo.constants";
import { Metadata } from "next";
import { Generation } from "./Generation";

export const metadata: Metadata = {
	title: "Генерация",
	...NO_INDEX_PAGE,
};
export default function GenerationPage() {
	return (
		<>
			<Generation />
		</>
	);
}
