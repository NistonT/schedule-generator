"use client";

import { ButtonMotionNavigation } from "@/components/ui/buttons/ButtonMotionNavigate";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { m } from "motion/react";

type Props = {
	handlePrevYear: () => void;
	handleNextYear: () => void;
};

export const YearNavigation = ({ handlePrevYear, handleNextYear }: Props) => {
	return (
		<m.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			className='flex justify-between items-center my-4'
		>
			<ButtonMotionNavigation
				title={"Предыдущий год"}
				icon={ChevronLeft}
				onClick={handlePrevYear}
			/>
			<ButtonMotionNavigation
				title={"Следующий год"}
				icon={ChevronRight}
				onClick={handleNextYear}
				iconLeft={false}
			/>
		</m.div>
	);
};
