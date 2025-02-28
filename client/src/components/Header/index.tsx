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
			className='absolute w-full z-30'
		>
			<div className='mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center relative'>
				<m.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					className='flex items-center top-5'
				>
					<m.div className='relative xl:text-3xl lg:text-2xl md:text-xl px-6 py-4 text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-md transition-all cursor-default flex items-center gap-3 overflow-hidden'>
						<Link className='flex items-center gap-3 relative z-10' href={"/"}>
							<Bot className='xl:w-10 xl:h-10 lg:w-8 lg:h-8 md:w-6 md:h-6 sm:block hidden' />
							ГЕНЕРАТОР API
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
					<span className='text-gray-600 text-xl py-4 px-8 transition-all'>
						| {headerText}
					</span>
				</m.div>
			</div>
		</m.header>
	);
};
