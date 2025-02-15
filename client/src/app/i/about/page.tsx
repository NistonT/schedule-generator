import { NO_INDEX_PAGE } from "@/constants/seo.constants";
import { Metadata } from "next";
import { About } from "./About";
import Providers from "./providers";

export const metadata: Metadata = {
	title: "О сайте",
	...NO_INDEX_PAGE,
};

export default function AboutPage() {
	return (
		<Providers>
			<About />
		</Providers>
	);
}
