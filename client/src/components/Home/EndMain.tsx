import { Steps } from "./Steps";
import { Web } from "./Web";

export const EndMain = () => {
	return (
		<>
			<section className='text-gray-600 body-font w-full flex-1'>
				<Steps />
				<Web />
			</section>
		</>
	);
};
