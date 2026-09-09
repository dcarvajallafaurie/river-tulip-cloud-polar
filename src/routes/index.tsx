import { useMemo, useState, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Panel } from "@/components/app-shell";
import { CompactWeek, TodayTimeline, WeekGrid } from "@/components/week-grid";
import { TaskGroup, TaskRow, sortActivities } from "@/components/task-list";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ActivityForm } from "@/components/activity-form";
import { useAcademicStore, useActiveSemester, useSemesterCourses } from "@/lib/store";
import {
  computedFinalGrade,
  currentCorte,
  formatGrade,
  progressThrough,
  semesterAverage,
} from "@/lib/academic";
import { dueState, formatTodayHeading, jsDayToSlot, toISODate } from "@/lib/dates";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const semester = useActiveSemester();
  const courses = useSemesterCourses(semester?.id);
  const activities = useAcademicStore((s) => s.activities);
  const settings = useAcademicStore((s) => s.settings);
  const toggleActivity = useAcademicStore((s) => s.toggleActivity);
  const addActivity = useAcademicStore((s) => s.addActivity);
  const [open, setOpen] = useState(false);

  const todayISO = toISODate(new Date());
  const corte = currentCorte(semester, todayISO);
  const avg = semesterAverage(courses, activities, semester, settings.gradeMax);
  const todaySlot = jsDayToSlot(new Date().getDay());
  const classesToday =
    todaySlot == null
      ? 0
      : courses.reduce((n, c) => n + c.schedule.filter((s) => s.day === todaySlot).length, 0);

  const pending = useMemo(() => {
    const mine = activities.filter((a) => courses.some((c) => c.id === a.courseId));
    return sortActivities(mine.filter((a) => !a.done));
  }, [activities, courses]);

  const overdue = pending.filter((a) => dueState(a.dueDate, false) === "overdue");
  const today = pending.filter((a) => dueState(a.dueDate, false) === "today");
  const soon = pending.filter((a) => {
    const st = dueState(a.dueDate, false);
    return st === "soon" || st === "later";
  });
  const dashboardTasks = [...overdue, ...today, ...soon].slice(0, 8);

  const progress = semester
    ? progressThrough(semester.startDate, semester.endDate, todayISO)
    : 0;
  const corteProgress = corte
    ? progressThrough(corte.startDate, corte.endDate, todayISO)
    : 0;

  const courseById = useMemo(
    () => Object.fromEntries(courses.map((c) => [c.id, c])),
    [courses],
  );

  return (
    <div>
      <PageHeader
        kicker={semester ? `${semester.name} · ${semester.type}` : "Aula"}
        title={formatTodayHeading()}
        description="Horario de la semana, clases de hoy y las tareas que no puedes dejar pasar."
        actions={
          <Button variant="ink" onClick={() => setOpen(true)}>
            <Plus className="size-4" />
            Nueva tarea
          </Button>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat
          label="Promedio"
          value={
            <p className="font-display text-3xl tabular-nums text-ink">
              {formatGrade(avg, settings.gradeMax)}
            </p>
          }
          hint={
            avg == null
              ? "Sin notas aún"
              : avg >= settings.passingGrade
                ? "Aprobando el periodo"
                : "Por debajo de la mínima"
          }
          hintTone={avg != null && avg < settings.passingGrade ? "danger" : "ok"}
        />
        <Stat
          label="Tareas abiertas"
          value={<p className="font-display text-3xl tabular-nums text-ink">{pending.length}</p>}
          hint={overdue.length ? `${overdue.length} vencidas` : "Al día"}
          hintTone={overdue.length ? "danger" : "ok"}
        />
        <Stat
          label="Clases hoy"
          value={<p className="font-display text-3xl tabular-nums text-ink">{classesToday}</p>}
          hint={todaySlot == null ? "Domingo" : undefined}
        />
        <Stat
          label={corte ? corte.name : "Periodo"}
          value={
            <div className="w-full">
              <p className="font-display text-3xl tabular-nums text-ink">
                {Math.round((corte ? corteProgress : progress) * 100)}%
              </p>
              <Progress
                className="mt-2"
                value={(corte ? corteProgress : progress) * 100}
              />
            </div>
          }
          hint={
            semester
              ? `${Math.round(progress * 100)}% del ${semester.type === "semestral" ? "semestre" : "trimestre"}`
              : undefined
          }
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <Panel className="hidden min-w-0 overflow-hidden lg:block">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg text-ink">Horario de la semana</h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/horario">
                Ver horario
                <ChevronRight className="size-3.5" />
              </Link>
            </Button>
          </div>
          {courses.length === 0 ? (
            <Empty hint="Agrega una materia para ver el horario." to="/materias" />
          ) : (
            <WeekGrid courses={courses} anchor={new Date()} compact />
          )}
        </Panel>

        <div className="flex flex-col gap-4">
          <Panel className="lg:hidden">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg text-ink">Esta semana</h2>
              <Button asChild variant="ghost" size="sm">
                <Link to="/horario">
                  Horario
                  <ChevronRight className="size-3.5" />
                </Link>
              </Button>
            </div>
            {courses.length === 0 ? (
              <p className="text-sm text-ink-soft">Agrega materias para ver el horario.</p>
            ) : (
              <CompactWeek courses={courses} anchor={new Date()} />
            )}
          </Panel>
          <Panel>
            <h2 className="mb-3 font-display text-lg text-ink">Hoy</h2>
            <TodayTimeline courses={courses} />
          </Panel>
          <Panel>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-display text-lg text-ink">Tareas</h2>
              <Button asChild variant="ghost" size="sm">
                <Link to="/tareas">
                  Todas
                  <ChevronRight className="size-3.5" />
                </Link>
              </Button>
            </div>
            {dashboardTasks.length === 0 ? (
              <p className="text-sm text-ink-soft">No hay pendientes. Respira.</p>
            ) : (
              <div className="-mx-1">
                <TaskGroup title="Vencidas" count={overdue.length}>
                  {overdue.map((a) => (
                    <TaskRow
                      key={a.id}
                      activity={a}
                      course={courseById[a.courseId]}
                      onToggle={toggleActivity}
                      compact
                    />
                  ))}
                </TaskGroup>
                <TaskGroup title="Hoy" count={today.length}>
                  {today.map((a) => (
                    <TaskRow
                      key={a.id}
                      activity={a}
                      course={courseById[a.courseId]}
                      onToggle={toggleActivity}
                      compact
                    />
                  ))}
                </TaskGroup>
                <TaskGroup title="Próximas" count={soon.slice(0, 5).length}>
                  {soon.slice(0, 5).map((a) => (
                    <TaskRow
                      key={a.id}
                      activity={a}
                      course={courseById[a.courseId]}
                      onToggle={toggleActivity}
                      compact
                    />
                  ))}
                </TaskGroup>
              </div>
            )}
          </Panel>
        </div>
      </div>

      {courses.length > 0 ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => {
            const g = computedFinalGrade(c, activities, semester, settings.gradeMax);
            return (
              <Link
                key={c.id}
                to="/materias/$id"
                params={{ id: c.id }}
                className="flex items-center gap-3 rounded-[20px] bg-paper-2 p-3 shadow-card transition-[box-shadow,transform] duration-150 hover:shadow-card-hover active:scale-[0.99]"
              >
                <span
                  className="size-9 shrink-0 rounded-[10px]"
                  style={{ background: c.color }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">{c.name}</p>
                  <p className="truncate text-xs text-ink-soft">
                    {c.code || c.professor || c.type}
                  </p>
                </div>
                <span className="font-mono text-sm tabular-nums text-ink">
                  {g == null ? "—" : g.toFixed(settings.gradeMax === 100 ? 0 : 1)}
                </span>
              </Link>
            );
          })}
        </div>
      ) : null}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva tarea</DialogTitle>
            <DialogDescription>Queda en el tablero hasta que la marques como hecha.</DialogDescription>
          </DialogHeader>
          {courses.length === 0 ? (
            <p className="text-sm text-ink-soft">Primero crea una materia.</p>
          ) : (
            <ActivityForm
              courses={courses}
              semester={semester}
              submitLabel="Agregar"
              onCancel={() => setOpen(false)}
              onSubmit={(v) => {
                addActivity(v);
                toast.success("Tarea agregada");
                setOpen(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
  hintTone,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  hintTone?: "ok" | "danger";
}) {
  return (
    <div className="rounded-[20px] bg-paper-2 p-4 shadow-card">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">{label}</p>
      <div className="mt-2 flex min-h-12 items-center">{value}</div>
      {hint ? (
        <p className={hintTone === "danger" ? "mt-1 text-xs text-danger" : "mt-1 text-xs text-ink-soft"}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function Empty({ hint, to }: { hint: string; to: string }) {
  return (
    <div className="flex flex-col items-start gap-3 py-8">
      <p className="text-sm text-ink-soft">{hint}</p>
      <Button asChild variant="ink" size="sm">
        <Link to={to}>Agregar materia</Link>
      </Button>
    </div>
  );
}
