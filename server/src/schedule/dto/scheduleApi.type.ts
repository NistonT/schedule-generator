export interface TCabinet {
  id: number;
  name: string;
}

export interface TGroup {
  id: number;
  name: string;
}

export interface TSubject {
  id: number;
  name: string;
  group_id: number;
}

export interface TSubjectHours {
  id: number;
  subject_id: number;
  lecture_hours: number;
  lecture_remains: number;
  l1_hours: number;
  l1_remains: number;
  l2_hours: number;
  l2_remains: number;
}

export interface TTeacher {
  id: number;
  name: string;
  preferred_cabinet_id: number;
}

export interface TTeachersLink {
  id: number;
  teacher_id: number;
  subject_id: number;
}

export interface ScheduleInput {
  start_date: string; // Начальная дата
  end_date: string; // Конечная дата
  t_cabinets: TCabinet[];
  t_groups: TGroup[];
  t_subjects: TSubject[];
  t_subjects_hours: TSubjectHours[];
  t_teachers: TTeacher[];
  t_teachers_link: TTeachersLink[];
}
