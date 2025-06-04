type Props = {
	lessonsByGroup: Map<string, Map<string, number>>;
};

export const SubjectsByGroups = ({ lessonsByGroup }: Props) => {
	return (
		<>
			{/* Предметы по группам */}
			<h2 className='text-xl font-semibold mt-12 mb-4'>Предметы по группам</h2>
			<div className='space-y-6'>
				{Array.from(lessonsByGroup.entries()).map(([group, subjects]) => (
					<div key={group} className='border p-4 rounded-md bg-white shadow-sm'>
						<h3 className='text-lg font-medium mb-3'>Группа: {group}</h3>
						<ul className='space-y-2'>
							{Array.from(subjects.entries())
								.sort((a, b) => b[1] - a[1])
								.map(([subject, count]) => (
									<li
										key={subject}
										className='flex justify-between border-b pb-1'
									>
										<span>{subject}</span>
										<span className='font-medium text-gray-700'>
											{count} часов
										</span>
									</li>
								))}
						</ul>
					</div>
				))}
			</div>
		</>
	);
};
