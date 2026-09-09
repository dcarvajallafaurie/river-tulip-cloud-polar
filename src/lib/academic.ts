import type { Activity, Course, GradeScale, Semester } from "./types";
import { inRange } from "./dates";

export function roundGrade(value: number, max: GradeScale): number {
  if (max === 100) return Math.round(value);
  return Math.round(value * 10) / 10;
}

export function formatGrade(value: number | null | undefined, max: GradeScale): string {
  if (value == null || Number.isNaN(value)) return "—";
  if (max === 100) return String(Math.round(value));
  return value.toFixed(1);
}

export function gradeTone(
  value: number | null | undefined,
  passing: number,
  max: GradeScale,
): "empty" | "fail" | "pass" | "good" {
  if (value == null) return "empty";
  const good = max === 5 ? 4 : max === 10 ? 8 : 80;
  if (value < passing) return "fail";
  if (value >= good) return "good";
  return "pass";
}

export function activitiesForCorte(
  activities: Activity[],
  courseId: string,
  corteIndex: number,
): Activity[] {
  return activities.filter((a) => a.courseId === courseId && a.corteIndex === corteIndex);
}

export function computedCorteGrade(
  course: Course,
  activities: Activity[],
  corteIndex: number,
  max: GradeScale,
): number | null {
  const stored = course.cortes.find((c) => c.index === corteIndex)?.grade;
  if (stored != null) return stored;
  const graded = activitiesForCorte(activities, course.id, corteIndex).filter(
    (a) => a.grade != null,
  );
  if (graded.length === 0) return null;
  const avg = graded.reduce((s, a) => s + (a.grade ?? 0), 0) / graded.length;
  return roundGrade(avg, max);
}

export function computedFinalGrade(
  course: Course,
  activities: Activity[],
  semester: Semester | undefined,
  max: GradeScale,
): number | null {
  if (course.finalGrade != null) return course.finalGrade;
  if (!semester) return null;
  let weighted = 0;
  let weightSum = 0;
  for (const window of semester.cortes) {
    const g = computedCorteGrade(course, activities, window.index, max);
    if (g == null) continue;
    weighted += g * window.weight;
    weightSum += window.weight;
  }
  if (weightSum === 0) return null;
  return roundGrade(weighted / weightSum, max);
}

export function semesterAverage(
  courses: Course[],
  activities: Activity[],
  semester: Semester | undefined,
  max: GradeScale,
): number | null {
  if (!semester) return null;
  const mine = courses.filter((c) => c.semesterId === semester.id);
  let points = 0;
  let credits = 0;
  for (const course of mine) {
    const g = computedFinalGrade(course, activities, semester, max);
    if (g == null) continue;
    const cr = course.credits || 1;
    points += g * cr;
    credits += cr;
  }
  if (credits === 0) return null;
  return roundGrade(points / credits, max);
}

export function inferCorteIndex(dueDate: string, semester: Semester | undefined): number {
  if (!semester || semester.cortes.length === 0) return 0;
  for (const corte of semester.cortes) {
    if (inRange(dueDate, corte.startDate, corte.endDate)) return corte.index;
  }
  if (dueDate < semester.cortes[0].startDate) return 0;
  return semester.cortes[semester.cortes.length - 1].index;
}

export function currentCorte(semester: Semester | undefined, todayISO: string): CorteWindowLike | null {
  if (!semester) return null;
  return semester.cortes.find((c) => inRange(todayISO, c.startDate, c.endDate)) ?? null;
}

type CorteWindowLike = Semester["cortes"][number];

export function progressThrough(start: string, end: string, todayISO: string): number {
  const s = Date.parse(start);
  const e = Date.parse(end);
  const t = Date.parse(todayISO);
  if (!Number.isFinite(s) || !Number.isFinite(e) || e <= s) return 0;
  return Math.min(1, Math.max(0, (t - s) / (e - s)));
}
