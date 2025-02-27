"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { domAnimation, LazyMotion } from "motion/react";
import { PropsWithChildren, useState } from "react";

export function Providers({ children }: PropsWithChildren) {
	const [client] = useState(
		new QueryClient({
			defaultOptions: {
				queries: {
					// При изменение фокуса на окне, не производился запрос
					refetchOnWindowFocus: false,
				},
			},
		})
	);

	return (
		<>
			<QueryClientProvider client={client}>
				<LazyMotion features={domAnimation}>{children}</LazyMotion>
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</>
	);
}
