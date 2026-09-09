import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { addWeeks, format } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader, Panel } from "@/components/app-shell";
import { TodayTimeline, WeekGrid } from "@/components/week-grid";
import { Button } from "@/components/ui/button";
import { useActiveSemester, useSemesterCourses } from "@/lib/store";
import { DAYS } from "@/lib/types";
import { formatTimeRange, mondayOf, weekDays } from "@/lib/dates";

export const Route = createFileRoute("/horario")({ component: HorarioPage });

function HorarioPage() {
  const [anchor, setAnchor] = useState(() => new Date());
  const semester = useActiveSemester();
  const courses = useSemesterCourses(semester?.id);
  const days = weekDays(anchor);
  const start = mondayOf(anchor);
  const end = days[5];

  return (
    <div>
      <PageHeader
        kicker="Calendario"
        title="Horario"
        description="La grilla de la semana con cada módulo, salón y bloque."
        actions={
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => setAnchor((d) => addWeeks(d, -1))} aria-label="Semana anterior">
              <ChevronLeft />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setAnchor(new Date())}>
              Hoy
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setAnchor((d) => addWeeks(d, 1))} aria-label="Semana siguiente">
              <ChevronRight />
            </Button>
          </div>
        }
      />

      <p className="mb-4 text-sm text-ink-soft">
        {format(start, "d MMM", { locale: es })} – {end ? format(end, "d MMM yyyy", { locale: es }) : ""}
      </p>

      <Panel className="mb-4 min-w-0 overflow-hidden">
        {courses.length === 0 ? (
          <p className="py-10 text-center text-sm text-ink-soft">
            Aún no hay clases en este periodo.
          </p>
        ) : (
          <WeekGrid courses={courses} anchor={anchor} />
        )}
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <h2 className="mb-3 font-display text-lg">Hoy, en lista</h2>
          <TodayTimeline courses={courses} />
        </Panel>
        <Panel>
          <h2 className="mb-3 font-display text-lg">Bloques por materia</h2>
          <ul className="flex flex-col gap-3">
            {courses.map((c) => (
              <li key={c.id} className="flex gap-3">
                <span className="mt-1 size-3 shrink-0 rounded-full" style={{ background: c.color }} />
                <div className="min-w-0">
                  <p className="font-medium text-ink">{c.name}</p>
                  <p className="text-xs text-ink-soft">
                    {c.schedule.length === 0
                      ? "Sin horario"
                      : c.schedule
                          .map(
                            (s) =>
                              `${DAYS[s.day]?.short} ${formatTimeRange(s.startTime, s.endTime)}${s.room ? ` (${s.room})` : ""}`,
                          )
                          .join(" · ")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
