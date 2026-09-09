import { Link } from "@tanstack/react-router";
import { format, isSameDay, isToday } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { DAYS, type Course, type ScheduleSlot } from "@/lib/types";
import {
  formatTimeRange,
  jsDayToSlot,
  minutesToTime,
  timeToMinutes,
  weekDays,
} from "@/lib/dates";

interface Placed {
  course: Course;
  slot: ScheduleSlot;
  top: number;
  height: number;
  day: number;
}

function visibleRange(courses: Course[]): [number, number] {
  let min = 7 * 60;
  let max = 18 * 60;
  for (const c of courses) {
    for (const s of c.schedule) {
      min = Math.min(min, timeToMinutes(s.startTime));
      max = Math.max(max, timeToMinutes(s.endTime));
    }
  }
  min = Math.max(7 * 60, Math.floor(min / 60) * 60);
  max = Math.min(21 * 60, Math.ceil(max / 60) * 60);
  if (max - min < 8 * 60) max = Math.min(21 * 60, min + 11 * 60);
  return [min, max];
}

export function WeekGrid({
  courses,
  anchor,
  compact,
}: {
  courses: Course[];
  anchor: Date;
  compact?: boolean;
}) {
  const days = weekDays(anchor);
  const [startMin, endMin] = visibleRange(courses);
  const total = Math.max(endMin - startMin, 60);
  const hours: number[] = [];
  for (let m = startMin; m < endMin; m += 60) hours.push(m);
  const hourPx = compact ? 42 : 52;
  const bodyH = hours.length * hourPx;

  const placed: Placed[] = [];
  for (const course of courses) {
    for (const slot of course.schedule) {
      const s = timeToMinutes(slot.startTime);
      const e = timeToMinutes(slot.endTime);
      placed.push({
        course,
        slot,
        day: slot.day,
        top: ((s - startMin) / total) * bodyH,
        height: Math.max(((e - s) / total) * bodyH, 28),
      });
    }
  }

  const now = new Date();
  const nowSlot = jsDayToSlot(now.getDay());
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const showNow =
    nowSlot != null &&
    nowMin >= startMin &&
    nowMin <= endMin &&
    days.some((d) => isToday(d));
  const nowTop = ((nowMin - startMin) / total) * bodyH;

  return (
    <div className="min-w-0 overflow-x-auto">
      <div className={cn("min-w-[640px]", compact && "min-w-[560px]")}>
        <div
          className="grid"
          style={{ gridTemplateColumns: "52px repeat(6, minmax(0, 1fr))" }}
        >
          <div />
          {days.map((d, i) => {
            const today = isToday(d);
            return (
              <div key={i} className={cn("px-1 pb-2 text-center", today && "text-accent")}>
                <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
                  {DAYS[i].short}
                </p>
                <p
                  className={cn(
                    "mx-auto mt-0.5 flex size-7 items-center justify-center rounded-full text-sm tabular-nums",
                    today && "bg-accent text-accent-fg",
                    !today && "text-ink",
                  )}
                >
                  {format(d, "d", { locale: es })}
                </p>
              </div>
            );
          })}
        </div>

        <div className="relative" style={{ height: bodyH }}>
          <div
            className="absolute inset-0 grid"
            style={{ gridTemplateColumns: "52px repeat(6, minmax(0, 1fr))" }}
          >
            {hours.map((m) => (
              <div key={`t-${m}`} className="contents">
                <div className="relative -top-2 pr-2 text-right font-mono text-[10px] text-ink-faint tabular-nums">
                  {minutesToTime(m)}
                </div>
                {DAYS.map((day) => (
                  <div key={`${m}-${day.id}`} className="border-t border-rule/80" />
                ))}
              </div>
            ))}
          </div>

          <div
            className="absolute top-0 right-0 bottom-0 left-[52px] grid"
            style={{ gridTemplateColumns: "repeat(6, minmax(0, 1fr))" }}
          >
            {DAYS.map((day) => {
              const date = days[day.id];
              const isColToday = date ? isToday(date) : false;
              return (
                <div key={day.id} className={cn("relative", isColToday && "bg-accent/[0.04]")}>
                  {placed
                    .filter((p) => p.day === day.id)
                    .map((p) => (
                      <Link
                        key={p.slot.id}
                        to="/materias/$id"
                        params={{ id: p.course.id }}
                        className="absolute right-1 left-1 overflow-hidden rounded-[8px] px-1.5 py-1 text-left transition-transform duration-150 hover:brightness-[0.97] active:scale-[0.98]"
                        style={{
                          top: p.top + 2,
                          height: p.height - 4,
                          background: tint(p.course.color, 0.16),
                          boxShadow: `inset 3px 0 0 ${p.course.color}`,
                        }}
                      >
                        <p
                          className="truncate text-[11px] font-semibold leading-tight"
                          style={{ color: p.course.color }}
                        >
                          {p.course.name}
                        </p>
                        <p className="truncate font-mono text-[10px] text-ink-soft tabular-nums">
                          {formatTimeRange(p.slot.startTime, p.slot.endTime)}
                          {p.slot.room ? ` · ${p.slot.room}` : ""}
                        </p>
                      </Link>
                    ))}
                </div>
              );
            })}
          </div>

          {showNow && nowSlot != null ? (
            <div
              className="pointer-events-none absolute right-0 left-[52px] z-10"
              style={{ top: nowTop }}
            >
              <div className="relative h-px bg-danger">
                <span className="absolute -top-1 -left-1 size-2 rounded-full bg-danger" />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function TodayTimeline({
  courses,
  date = new Date(),
}: {
  courses: Course[];
  date?: Date;
}) {
  const slotDay = jsDayToSlot(date.getDay());
  const items: Array<{ course: Course; slot: ScheduleSlot }> = [];
  if (slotDay != null) {
    for (const course of courses) {
      for (const slot of course.schedule) {
        if (slot.day === slotDay) items.push({ course, slot });
      }
    }
  }
  items.sort((a, b) => timeToMinutes(a.slot.startTime) - timeToMinutes(b.slot.startTime));

  if (items.length === 0) {
    return (
      <p className="text-sm text-ink-soft">
        {slotDay == null ? "Hoy no hay clases (domingo)." : "No tienes clases este día."}
      </p>
    );
  }

  const nowMin = date.getHours() * 60 + date.getMinutes();
  const isThisDay = isSameDay(date, new Date());

  return (
    <ol className="flex flex-col gap-2">
      {items.map(({ course, slot }) => {
        const start = timeToMinutes(slot.startTime);
        const end = timeToMinutes(slot.endTime);
        const live = isThisDay && nowMin >= start && nowMin < end;
        const past = isThisDay && nowMin >= end;
        return (
          <li key={slot.id}>
            <Link
              to="/materias/$id"
              params={{ id: course.id }}
              className={cn(
                "flex items-stretch gap-3 rounded-[16px] bg-paper p-2 pr-3 shadow-card transition-[box-shadow,transform] duration-150 hover:shadow-card-hover active:scale-[0.99]",
                past && "opacity-60",
              )}
            >
              <div className="w-1.5 shrink-0 rounded-full" style={{ background: course.color }} />
              <div className="min-w-0 flex-1 py-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium text-ink">{course.name}</p>
                  {live ? (
                    <span className="rounded-full bg-danger/12 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-danger">
                      En curso
                    </span>
                  ) : null}
                </div>
                <p className="font-mono text-xs text-ink-soft tabular-nums">
                  {formatTimeRange(slot.startTime, slot.endTime)}
                  {slot.room ? ` · ${slot.room}` : ""}
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

export function CompactWeek({ courses, anchor }: { courses: Course[]; anchor: Date }) {
  const days = weekDays(anchor);
  return (
    <div className="grid grid-cols-6 gap-1.5">
      {days.map((d, i) => {
        const today = isToday(d);
        const blocks = courses.flatMap((c) =>
          c.schedule.filter((s) => s.day === i).map((slot) => ({ course: c, slot })),
        );
        return (
          <div
            key={i}
            className={cn(
              "rounded-[14px] px-1 py-2 text-center",
              today ? "bg-accent/10" : "bg-paper",
            )}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-faint">
              {DAYS[i].short}
            </p>
            <p
              className={cn(
                "mx-auto mt-0.5 mb-1.5 flex size-6 items-center justify-center rounded-full text-xs tabular-nums",
                today ? "bg-accent text-accent-fg" : "text-ink",
              )}
            >
              {format(d, "d")}
            </p>
            <div className="flex flex-col items-center gap-1">
              {blocks.length === 0 ? (
                <span className="block h-1.5 w-1.5 rounded-full bg-rule" />
              ) : (
                blocks.map((b) => (
                  <span
                    key={b.slot.id}
                    className="block h-1.5 w-1.5 rounded-full"
                    style={{ background: b.course.color }}
                    title={`${b.course.name} ${formatTimeRange(b.slot.startTime, b.slot.endTime)}`}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function tint(hex: string, alpha: number): string {
  const n = hex.replace("#", "");
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
