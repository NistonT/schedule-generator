"use client";
import { words } from "@/constants/words.constants";
import { useWordsHeader } from "@/hook/useWordsHeader";
import { Bot } from "lucide-react";
import { m } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export const Header = () => {
	const [headerText, setHeaderText] = useState("");
	const [isVisible, setIsVisible] = useState(true);
	const [prevScrollY, setPrevScrollY] = useState(0);

	useEffect(() => {
		const word = useWordsHeader(words);
		let count = -1;

		const interval = setInterval(() => {
			if (count < word.length) {
				count++;
				setHeaderText(prev => prev + word.charAt(count));
			} else {
				clearInterval(interval);
			}
		}, 30);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;

			if (currentScrollY > prevScrollY) {
				setIsVisible(false);
			} else {
				setIsVisible(true);
			}

			setPrevScrollY(currentScrollY);
		};

		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [prevScrollY]);

	return (
		<m.header
			initial={{ y: 0, opacity: 1 }}
			animate={{
				y: isVisible ? 0 : -100,
				opacity: isVisible ? 1 : 0,
			}}
			transition={{
				y: { type: "spring", stiffness: 100, damping: 20 },
				opacity: { duration: 0.2 },
			}}
			className='fixed w-full z-30 '
		>
			<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex flex-col md:flex-row items-center justify-between py-3 md:py-4'>
					<m.div
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						className='flex items-center'
					>
						<m.div className='relative text-sm sm:text-base lg:text-lg px-3 py-2 text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-md transition-all cursor-default flex items-center gap-2 sm:gap-3 overflow-hidden'>
							<Link
								className='flex items-center gap-2 sm:gap-3 relative z-10'
								href={"/"}
							>
								<Bot className='w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7' />
								<span>ГЕНЕРАТОР API</span>
							</Link>

							<m.div
								className='absolute inset-0 bg-[length:200%_200%] bg-gradient-to-r from-transparent via-white/15 to-transparent transform rotate-0'
								animate={{
									backgroundPosition: ["100% 100%", "-100% -100%"],
								}}
								transition={{
									duration: 4,
									repeat: Infinity,
									ease: "linear",
								}}
							/>
						</m.div>
						<span className='text-gray-600 text-sm sm:text-base ml-2 sm:ml-4 py-1 sm:py-2'>
							| {headerText}
						</span>
					</m.div>
				</div>
			</div>
		</m.header>
	);
};
