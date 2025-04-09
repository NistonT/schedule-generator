"use client";

import { useQuery } from "@tanstack/react-query";

export const FeedbackList = () => {
	const { data: feedback_list } = useQuery({
		queryKey: ["feedback_list"],
	});

	return <></>;
};
