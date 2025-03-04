import { Header } from "@/components/Header";
import { SITE_NAME } from "@/constants/seo.constants";
import type { Metadata } from "next";
import { Montserrat, Noto_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from "./providers";

const zen = Noto_Sans({
	subsets: ["cyrillic", "latin"],
	weight: ["300", "400", "500", "600", "700"],
	display: "swap",
	variable: "--font-zen",
	style: ["normal"],
});

const montserrat = Montserrat({
	variable: "--font-montserrat",
	subsets: ["cyrillic", "latin"],
	weight: ["400", "500", "600", "700"],
	preload: true,
});

export const metadata: Metadata = {
	title: {
		default: SITE_NAME,
		template: `%s | ${SITE_NAME}`,
	},
	description: "Generated schedule",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' className='light'>
			<body className={`${zen.variable} ${montserrat.variable} antialiased`}>
				<Providers>
					<Header />
					<section>{children}</section>
					<Toaster theme='light' position='top-center' duration={1500} />
				</Providers>
			</body>
		</html>
	);
}
