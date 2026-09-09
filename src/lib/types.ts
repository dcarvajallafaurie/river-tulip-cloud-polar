export type PeriodType = "semestral" | "trimestral";

export type GradeScale = 5 | 10 | 100;

export interface Settings {
  gradeMax: GradeScale;
  passingGrade: number;
  studentName: string;
  university: string;
}

export interface CorteWindow {
  index: number;
  name: string;
  startDate: string;
  endDate: string;
  weight: number;
}

export interface Semester {
  id: string;
  name: string;
  type: PeriodType;
  startDate: string;
  endDate: string;
  cortes: CorteWindow[];
  isActive: boolean;
}

export interface ScheduleSlot {
  id: string;
  day: number;
  startTime: string;
  endTime: string;
  room: string;
}

export interface CorteGrade {
  index: number;
  grade: number | null;
}

export interface Course {
  id: string;
  semesterId: string;
  name: string;
  code: string;
  professor: string;
  color: string;
  type: PeriodType;
  startDate: string;
  endDate: string;
  credits: number;
  schedule: ScheduleSlot[];
  cortes: CorteGrade[];
  finalGrade: number | null;
  notes: string;
}

export interface Activity {
  id: string;
  courseId: string;
  name: string;
  description: string;
  dueDate: string;
  done: boolean;
  corteIndex: number;
  grade: number | null;
  createdAt: string;
}

export const DAYS = [
  { id: 0, short: "Lun", long: "Lunes" },
  { id: 1, short: "Mar", long: "Martes" },
  { id: 2, short: "Mié", long: "Miércoles" },
  { id: 3, short: "Jue", long: "Jueves" },
  { id: 4, short: "Vie", long: "Viernes" },
  { id: 5, short: "Sáb", long: "Sábado" },
] as const;

export const COURSE_COLORS = [
  "#2C4A5E",
  "#3D5340",
  "#6B3E3A",
  "#3E5560",
  "#5C4A38",
  "#3A5550",
  "#4A4658",
  "#5A4630",
] as const;
