import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Panel } from "@/components/app-shell";
import { TaskGroup, TaskRow, sortActivities } from "@/components/task-list";
import { ActivityForm } from "@/components/activity-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAcademicStore, useActiveSemester, useSemesterCourses } from "@/lib/store";
import { dueState } from "@/lib/dates";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tareas")({ component: TareasPage });

type Filter = "pendientes" | "hechas" | "todas";

function TareasPage() {
  const [filter, setFilter] = useState<Filter>("pendientes");
  const [open, setOpen] = useState(false);
  const semester = useActiveSemester();
  const courses = useSemesterCourses(semester?.id);
  const activities = useAcademicStore((s) => s.activities);
  const toggleActivity = useAcademicStore((s) => s.toggleActivity);
  const addActivity = useAcademicStore((s) => s.addActivity);

  const courseById = useMemo(
    () => Object.fromEntries(courses.map((c) => [c.id, c])),
    [courses],
  );

  const mine = useMemo(
    () =>
      sortActivities(activities.filter((a) => courses.some((c) => c.id === a.courseId))),
    [activities, courses],
  );

  const visible = mine.filter((a) => {
    if (filter === "pendientes") return !a.done;
    if (filter === "hechas") return a.done;
    return true;
  });

  const overdue = visible.filter((a) => dueState(a.dueDate, a.done) === "overdue");
  const today = visible.filter((a) => dueState(a.dueDate, a.done) === "today");
  const soon = visible.filter((a) => dueState(a.dueDate, a.done) === "soon");
  const later = visible.filter((a) => dueState(a.dueDate, a.done) === "later");
  const done = visible.filter((a) => a.done);

  return (
    <div>
      <PageHeader
        kicker="Pendientes"
        title="Tareas"
        description="Marca cada actividad cuando la termines. Lo vencido aparece primero."
        actions={
          <Button variant="ink" onClick={() => setOpen(true)} disabled={courses.length === 0}>
            <Plus className="size-4" />
            Nueva tarea
          </Button>
        }
      />

      <div className="mb-5 flex gap-1 rounded-[14px] bg-paper-3 p-1 w-fit">
        {(
          [
            ["pendientes", "Pendientes"],
            ["hechas", "Hechas"],
            ["todas", "Todas"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={cn(
              "rounded-[10px] px-3 py-1.5 text-sm font-medium transition-colors duration-150",
              filter === id ? "bg-paper-2 text-ink shadow-card" : "text-ink-soft hover:text-ink",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <Panel>
        {visible.length === 0 ? (
          <p className="py-10 text-center text-sm text-ink-soft">
            {courses.length === 0
              ? "Crea una materia para poder cargar actividades."
              : filter === "hechas"
                ? "Todavía no marcas ninguna como hecha."
                : "No hay tareas en esta vista."}
          </p>
        ) : (
          <div className="flex flex-col gap-5">
            <TaskGroup title="Vencidas" count={overdue.length}>
              {overdue.map((a) => (
                <TaskRow key={a.id} activity={a} course={courseById[a.courseId]} onToggle={toggleActivity} />
              ))}
            </TaskGroup>
            <TaskGroup title="Hoy" count={today.length}>
              {today.map((a) => (
                <TaskRow key={a.id} activity={a} course={courseById[a.courseId]} onToggle={toggleActivity} />
              ))}
            </TaskGroup>
            <TaskGroup title="Próximos días" count={soon.length}>
              {soon.map((a) => (
                <TaskRow key={a.id} activity={a} course={courseById[a.courseId]} onToggle={toggleActivity} />
              ))}
            </TaskGroup>
            <TaskGroup title="Más adelante" count={later.length}>
              {later.map((a) => (
                <TaskRow key={a.id} activity={a} course={courseById[a.courseId]} onToggle={toggleActivity} />
              ))}
            </TaskGroup>
            <TaskGroup title="Hechas" count={done.length}>
              {done.map((a) => (
                <TaskRow key={a.id} activity={a} course={courseById[a.courseId]} onToggle={toggleActivity} />
              ))}
            </TaskGroup>
          </div>
        )}
      </Panel>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva tarea</DialogTitle>
            <DialogDescription>Asóciala a una materia y a un corte.</DialogDescription>
          </DialogHeader>
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
        </DialogContent>
      </Dialog>
    </div>
  );
}
