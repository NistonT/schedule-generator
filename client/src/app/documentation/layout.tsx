export default function DocumentationLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			{/* <Providers>{children}</Providers> */}
			{children}
		</>
	);
}
