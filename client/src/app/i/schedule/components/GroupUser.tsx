import { User } from "lucide-react";

type Props = {
	group: string;
};

export const GroupUser = ({ group }: Props) => {
	return (
		<h2 className='text-xl font-semibold flex items-center gap-2 text-gray-700'>
			<User size={20} className='text-gray-500' /> Группа: {group}
		</h2>
	);
};
