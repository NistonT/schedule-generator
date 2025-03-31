import { useState } from "react";
import { DayCalendar } from "./DayCalendar";
import { Lesson } from "./Lesson";
import { NullLesson } from "./NullLesson";

type Props = {
	lessons: any[][];
	day: string;
	group: string;
};

export const Lessons = ({ lessons, day, group }: Props) => {
	const [lessonsReorder, setLessonsReorder] = useState(lessons);

	return (
		<div
			key={`${group}-${day}`}
			className='bg-gray-50 p-4 rounded-md shadow-sm space-y-2'
		>
			<DayCalendar day={day} />

			{lessons.length === 0 ? (
				<NullLesson />
			) : (
				lessonsReorder.map((lessonSlot, index) =>
					Array.isArray(lessonSlot)
						? lessonSlot.map((lesson, lessonIndex) => (
								<Lesson
									index={lessonIndex}
									subject={lesson.subject}
									cabinet={lesson.cabinet}
									teacher={lesson.teacher}
									lessonType={lesson.lessonType}
								/>
						  ))
						: null
				)
			)}
		</div>
	);
};
