import { EndMain } from "./EndMain";
import { FirstMain } from "./FirstMain";

export const Home = () => {
	const sectionsMain = [<FirstMain />, <EndMain />];

	return (
		<>
			<div className='bg-white flex flex-col items-center justify-center min-h-screen w-full overflow-hidden'>
				{sectionsMain.map(section => section)}
			</div>
		</>
	);
};
