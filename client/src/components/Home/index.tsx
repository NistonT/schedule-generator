import { Nav } from "./Nav";
import { Steps } from "./Steps";
import { Title } from "./Title";
import { Web } from "./Web";

export const Home = () => (
	<div className='min-h-screen bg-white flex flex-col items-center justify-center p-4'>
		<Title />
		<Nav />
		<section className='text-gray-600 body-font'>
			<Steps />
			<Web />
		</section>
	</div>
);
