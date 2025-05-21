type Props = {
	subjectCountList: [string, number][];
};

export const SubjectsAndCount = ({ subjectCountList }: Props) => {
	return (
		<>
			{/* Таблица предметов и количество уроков */}
			<h2 className='text-xl font-semibold mt-8 mb-4'>Предметы в расписании</h2>
			<div className='overflow-x-auto'>
				<table className='min-w-full bg-white border border-gray-300'>
					<thead className='bg-gray-100'>
						<tr>
							<th className='py-2 px-4 border-r'>Предмет</th>
							<th className='py-2 px-4'>Количество часов</th>
						</tr>
					</thead>
					<tbody>
						{subjectCountList.map(([subject, count]) => (
							<tr key={subject} className='hover:bg-gray-50'>
								<td className='py-2 px-4 border-r border-b'>{subject}</td>
								<td className='py-2 px-4 text-center border-b'>{count}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	);
};
