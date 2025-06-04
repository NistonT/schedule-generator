import { NO_INDEX_PAGE } from "@/constants/seo.constants";
import { Metadata } from "next";
import { Schedule } from "./Schedule";

export const metadata: Metadata = {
	title: "Расписание",
	...NO_INDEX_PAGE,
};

export default function SchedulePage() {
	return <Schedule />;
}
