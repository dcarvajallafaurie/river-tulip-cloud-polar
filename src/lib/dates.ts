import {
  addDays,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isToday,
  parseISO,
  startOfDay,
  startOfWeek,
} from "date-fns";
import { es } from "date-fns/locale";

export function parseDate(iso: string): Date {
  return parseISO(iso.length <= 10 ? `${iso}T12:00:00` : iso);
}

export function toISODate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function formatLongDate(iso: string): string {
  return format(parseDate(iso), "d 'de' MMMM", { locale: es });
}

export function formatShortDate(iso: string): string {
  return format(parseDate(iso), "d MMM", { locale: es });
}

export function formatWeekdayDate(iso: string): string {
  return format(parseDate(iso), "EEE d MMM", { locale: es });
}

export function formatTodayHeading(date = new Date()): string {
  const raw = format(date, "EEEE d 'de' MMMM", { locale: es });
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export function mondayOf(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 1 });
}

export function weekDays(anchor: Date): Date[] {
  const start = mondayOf(anchor);
  return Array.from({ length: 6 }, (_, i) => addDays(start, i));
}

export function timeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

export function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function formatTimeRange(start: string, end: string): string {
  const strip = (t: string) => (t.endsWith(":00") ? t.slice(0, 5).replace(/^0/, "") : t);
  return `${strip(start)}–${strip(end)}`;
}

export function jsDayToSlot(jsDay: number): number | null {
  if (jsDay === 0) return null;
  return jsDay - 1;
}

export function dueState(iso: string, done: boolean): "done" | "overdue" | "today" | "soon" | "later" {
  if (done) return "done";
  const d = startOfDay(parseDate(iso));
  const today = startOfDay(new Date());
  if (isToday(d)) return "today";
  if (isBefore(d, today)) return "overdue";
  const inThree = addDays(today, 3);
  if (!isAfter(d, inThree) || isSameDay(d, inThree)) return "soon";
  return "later";
}

export function inRange(iso: string, start: string, end: string): boolean {
  const d = parseDate(iso);
  return !isBefore(d, parseDate(start)) && !isAfter(d, parseDate(end));
}
