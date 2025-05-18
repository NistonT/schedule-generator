import { IUser } from "@/types/user.type";
import { IdCard, Settings } from "lucide-react";

type Props = {
	data: IUser | undefined;
};

export const Title = ({ data }: Props) => {
	return (
		<>
			<div className='flex items-center justify-between mb-8'>
				<h1 className='text-3xl font-bold text-gray-950 flex items-center gap-1'>
					<Settings width={30} height={30} /> <span>Настройки</span>
				</h1>
				<div className='text-sm flex items-center gap-1'>
					<IdCard /> {data?.id}
				</div>
			</div>
		</>
	);
};
