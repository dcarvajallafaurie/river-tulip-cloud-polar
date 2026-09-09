import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Clock3 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  activitiesFromForm,
  buildCourseFromForm,
  CourseForm,
} from "@/components/course-form";
import { GradeChip } from "@/components/grade-meter";
import { useAcademicStore, useActiveSemester, useSemesterCourses } from "@/lib/store";
import { computedFinalGrade } from "@/lib/academic";
import { DAYS } from "@/lib/types";
import { formatTimeRange } from "@/lib/dates";

export const Route = createFileRoute("/materias")({
  component: MateriasPage,
});

function MateriasPage() {
  const [localOpen, setLocalOpen] = useState(false);
  const newCourseOpen = useAcademicStore((s) => s.newCourseOpen);
  const setNewCourseOpen = useAcademicStore((s) => s.setNewCourseOpen);
  const semester = useActiveSemester();
  const courses = useSemesterCourses(semester?.id);
  const activities = useAcademicStore((s) => s.activities);
  const settings = useAcademicStore((s) => s.settings);
  const addCourse = useAcademicStore((s) => s.addCourse);
  const addActivity = useAcademicStore((s) => s.addActivity);

  const dialogOpen = localOpen || newCourseOpen;

  function closeDialog() {
    setLocalOpen(false);
    setNewCourseOpen(false);
  }

  function openDialog() {
    setLocalOpen(true);
  }

  return (
    <div>
      <PageHeader
        kicker="Módulos"
        title="Materias"
        description="Cada clase con su horario, tipo de periodo, actividades y nota final."
        actions={
          <Button variant="ink" onClick={openDialog} disabled={!semester}>
            <Plus className="size-4" />
            Nueva materia
          </Button>
        }
      />

      {!semester ? (
        <p className="text-sm text-ink-soft">Crea un periodo académico primero.</p>
      ) : courses.length === 0 ? (
        <div className="rounded-[24px] bg-paper-2 px-6 py-14 text-center shadow-card">
          <p className="font-display text-xl text-ink">Todavía no hay materias</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">
            Agrega el módulo, el horario, las fechas y las actividades — igual que en tu hoja de cálculo.
          </p>
          <Button className="mt-5" variant="ink" onClick={openDialog}>
            Registrar materia
          </Button>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {courses.map((c) => {
            const g = computedFinalGrade(c, activities, semester, settings.gradeMax);
            const pending = activities.filter((a) => a.courseId === c.id && !a.done).length;
            return (
              <li key={c.id}>
                <Link
                  to="/materias/$id"
                  params={{ id: c.id }}
                  className="flex h-full flex-col rounded-[24px] bg-paper-2 p-4 shadow-card transition-[box-shadow,transform] duration-150 hover:shadow-card-hover active:scale-[0.995] sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <span
                        className="mt-0.5 size-9 shrink-0 rounded-[10px]"
                        style={{ background: c.color }}
                      />
                      <div className="min-w-0">
                        <p className="font-display text-lg leading-tight text-ink">{c.name}</p>
                        <p className="mt-0.5 truncate text-xs text-ink-soft">
                          {[c.code, c.professor].filter(Boolean).join(" · ") || "Sin código"}
                        </p>
                      </div>
                    </div>
                    <GradeChip value={g} max={settings.gradeMax} passing={settings.passingGrade} />
                  </div>
                  <p className="mt-3 flex items-start gap-2 text-xs text-ink-soft">
                    <Clock3 className="mt-0.5 size-3.5 shrink-0" />
                    <span>
                      {c.schedule.length === 0
                        ? "Sin horario cargado"
                        : c.schedule
                            .map(
                              (s) =>
                                `${DAYS[s.day]?.short} ${formatTimeRange(s.startTime, s.endTime)}`,
                            )
                            .join(" · ")}
                    </span>
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    <Badge>{c.type}</Badge>
                    <Badge>{c.credits} cr.</Badge>
                    {pending > 0 ? (
                      <Badge tone="warn">{pending} pendientes</Badge>
                    ) : (
                      <Badge tone="success">Al día</Badge>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <Dialog open={dialogOpen} onOpenChange={(v) => (v ? openDialog() : closeDialog())}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Registrar materia</DialogTitle>
            <DialogDescription>
              Módulo, horario, fecha de inicio y final, tipo de clase y actividades.
            </DialogDescription>
          </DialogHeader>
          {semester ? (
            <CourseForm
              semester={semester}
              submitLabel="Guardar materia"
              onCancel={closeDialog}
              onSubmit={(values) => {
                const course = buildCourseFromForm(values, semester);
                addCourse(course);
                for (const a of activitiesFromForm(values, course.id, semester)) {
                  addActivity(a);
                }
                toast.success(`${course.name} quedó en el periodo`);
                closeDialog();
              }}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
