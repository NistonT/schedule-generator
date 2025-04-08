import { NO_INDEX_PAGE } from "@/constants/seo.constants";
import { Metadata } from "next";
import { Feedback } from "./Feedback";

export const metadata: Metadata = {
	title: "Обратная связь",
	...NO_INDEX_PAGE,
};

export default function FeedbackPage() {
	return <Feedback />;
}
