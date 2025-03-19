"use client";

import { m } from "motion/react";

export const LoadingGeneration = () => {
	return (
		<div className='flex'>
			<m.div
				className='px-4 py-2 h-8 w-full bg-gray-100 rounded-md overflow-hidden relative shadow-sm'
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
			>
				<m.div
					initial={{ x: -150 }}
					animate={{ x: 1500 }}
					transition={{
						duration: 1,
						repeat: Infinity,
						repeatType: "loop",
						ease: "linear",
					}}
					className='w-32 h-full absolute top-0 left-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent'
				/>
			</m.div>
		</div>
	);
};
