import { DASHBOARD_PAGES } from "@/config/pages-url.config";
import image_404 from "@public/image/404_image.png";
import { House } from "lucide-react";
import Image from "next/image";
import { ButtonMotionLink } from "../ui/buttons/ButtonMotionLink";

export const NotFound = () => {
	return (
		<div className='w-full flex overflow-hidden gap-0 pt-5'>
			<div className='w-full h-screen relative flex justify-center items-center px-4'>
				<div className='relative w-full h-5/6 rounded-xl overflow-hidden bg-gray-950'>
					<div className='absolute top-0 right-0 h-full w-1/3 z-10'>
						<Image
							src={image_404}
							alt='404 Not Found'
							fill
							className='object-cover opacity-50'
						/>
						<div className='absolute right-1/2 bottom-10 translate-x-1/2 text-white text-6xl font-thin z-10'>
							ОКАК
						</div>
					</div>

					<div className='text-white text-8xl font-bold p-5 relative z-30'>
						<div>Страница</div>
						<div>не работает</div>
					</div>

					<div className='text-white text-2xl font-bold p-5 absolute z-30 bottom-0'>
						<ButtonMotionLink
							href={DASHBOARD_PAGES.HOME}
							title={"Вернуться на главную"}
							icon={<House />}
						/>
					</div>

					<div className='absolute text-gray-800 text-[350px] right-1/2 top-0 translate-x-1/2 font-bold z-10'>
						404
					</div>

					<div className='absolute inset-0 bg-black/30 z-20' />
				</div>
			</div>
		</div>
	);
};
