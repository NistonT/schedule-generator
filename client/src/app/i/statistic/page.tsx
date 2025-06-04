import { NO_INDEX_PAGE } from "@/constants/seo.constants";
import { Metadata } from "next";
import { Statistic } from "./Statistic";

export const metadata: Metadata = {
	title: "Статистика",
	...NO_INDEX_PAGE,
};
export default function StatisticPage() {
	return (
		<>
			<Statistic />
		</>
	);
}
