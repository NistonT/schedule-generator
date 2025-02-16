import { NO_INDEX_PAGE } from "@/constants/seo.constants";
import { Metadata } from "next";
import { Profile } from "./Profile";
import Providers from "./providers";

export const metadata: Metadata = {
	title: "Профиль",
	...NO_INDEX_PAGE,
};
export default function ProfilePage() {
	return (
		<>
			<Providers>
				<Profile />
			</Providers>
		</>
	);
}
