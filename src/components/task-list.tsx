import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type { Activity, Course } from "@/lib/types";
import { dueState, formatWeekdayDate } from "@/lib/dates";
import { Checkbox } from "@/components/ui/checkbox";

const DUE_LABEL: Record<ReturnType<typeof dueState>, string> = {
  done: "Hecha",
  overdue: "Vencida",
  today: "Hoy",
  soon: "Pronto",
  later: "",
};

export function TaskRow({
  activity,
  course,
  onToggle,
  compact,
}: {
  activity: Activity;
  course?: Course;
  onToggle: (id: string) => void;
  compact?: boolean;
}) {
  const state = dueState(activity.dueDate, activity.done);
  return (
    <div
      className={cn(
        "group flex items-start gap-3 rounded-[14px] px-2 py-2 transition-colors duration-150 hover:bg-paper-2",
        activity.done && "opacity-60",
      )}
    >
      <Checkbox
        checked={activity.done}
        onCheckedChange={() => onToggle(activity.id)}
        aria-label={activity.done ? "Marcar como pendiente" : "Marcar como hecha"}
        className="mt-0.5"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "text-sm font-medium text-ink",
              activity.done && "line-through decoration-ink-faint",
            )}
          >
            {activity.name}
          </p>
          {state === "overdue" || state === "today" ? (
            <span
              className={cn(
                "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                state === "overdue" && "bg-danger/12 text-danger",
                state === "today" && "bg-accent/12 text-accent",
              )}
            >
              {DUE_LABEL[state]}
            </span>
          ) : null}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-ink-soft">
          {course ? (
            <Link
              to="/materias/$id"
              params={{ id: course.id }}
              className="inline-flex items-center gap-1.5 hover:text-ink"
            >
              <span
                className="size-1.5 rounded-full"
                style={{ background: course.color }}
              />
              <span className="truncate">{course.name}</span>
            </Link>
          ) : null}
          <span className="tabular-nums">{formatWeekdayDate(activity.dueDate)}</span>
          {!compact && activity.description ? (
            <span className="hidden truncate sm:inline">· {activity.description}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function TaskGroup({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: ReactNode;
}) {
  if (count === 0) return null;
  return (
    <section className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between px-2">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
          {title}
        </h3>
        <span className="font-mono text-[11px] text-ink-faint tabular-nums">{count}</span>
      </div>
      <div>{children}</div>
    </section>
  );
}

export function sortActivities(list: Activity[]): Activity[] {
  return [...list].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return a.dueDate.localeCompare(b.dueDate);
  });
}
