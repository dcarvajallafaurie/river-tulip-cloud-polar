import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Panel } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ActivityForm } from "@/components/activity-form";
import { buildCourseFromForm, CourseForm } from "@/components/course-form";
import { GradeChip, GradeMeter } from "@/components/grade-meter";
import { TaskRow, sortActivities } from "@/components/task-list";
import { useAcademicStore, useActiveSemester } from "@/lib/store";
import {
  activitiesForCorte,
  computedCorteGrade,
  computedFinalGrade,
  formatGrade,
} from "@/lib/academic";
import { DAYS } from "@/lib/types";
import { formatLongDate, formatTimeRange } from "@/lib/dates";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/materias/$id")({ component: CourseDetail });

function CourseDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const course = useAcademicStore((s) => s.courses.find((c) => c.id === id));
  const allSemesters = useAcademicStore((s) => s.semesters);
  const allActivities = useAcademicStore((s) => s.activities);
  const courseSemester = allSemesters.find((x) => x.id === course?.semesterId);
  const activeSemester = useActiveSemester();
  const semester = courseSemester ?? activeSemester;
  const activities = useMemo(
    () => allActivities.filter((a) => a.courseId === id),
    [allActivities, id],
  );
  const settings = useAcademicStore((s) => s.settings);
  const toggleActivity = useAcademicStore((s) => s.toggleActivity);
  const updateCourse = useAcademicStore((s) => s.updateCourse);
  const deleteCourse = useAcademicStore((s) => s.deleteCourse);
  const addActivity = useAcademicStore((s) => s.addActivity);
  const deleteActivity = useAcademicStore((s) => s.deleteActivity);

  const [editOpen, setEditOpen] = useState(false);
  const [actOpen, setActOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [finalDraft, setFinalDraft] = useState("");

  const final = course
    ? computedFinalGrade(course, activities, semester, settings.gradeMax)
    : null;

  const byCorte = useMemo(() => {
    if (!semester) return [];
    return semester.cortes.map((window) => ({
      window,
      grade: course
        ? computedCorteGrade(course, activities, window.index, settings.gradeMax)
        : null,
      items: sortActivities(activitiesForCorte(activities, id, window.index)),
    }));
  }, [semester, course, activities, id, settings.gradeMax]);

  if (!course) {
    return (
      <div className="py-16 text-center">
        <p className="font-display text-2xl">No encontramos esa materia</p>
        <Button asChild className="mt-4" variant="ink">
          <Link to="/materias">Volver</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/materias"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        Materias
      </Link>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="size-11 shrink-0 rounded-[12px]" style={{ background: course.color }} />
          <div className="min-w-0">
            <h1 className="font-display text-[1.85rem] leading-tight text-ink">{course.name}</h1>
            <p className="mt-1 text-sm text-ink-soft">
              {[course.code, course.professor].filter(Boolean).join(" · ") || "Sin datos del docente"}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge>{course.type}</Badge>
              <Badge>{course.credits} créditos</Badge>
              <Badge tone="accent">
                {formatLongDate(course.startDate)} – {formatLongDate(course.endDate)}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setEditOpen(true)}>
            <Pencil className="size-4" />
            Editar
          </Button>
          <Button variant="ghost" className="text-danger hover:bg-danger/10" onClick={() => setConfirmDelete(true)}>
            <Trash2 className="size-4" />
            Borrar
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
        <div className="flex flex-col gap-4">
          <Panel>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg">Horario</h2>
            </div>
            {course.schedule.length === 0 ? (
              <p className="text-sm text-ink-soft">Sin bloques de horario.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {course.schedule.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between rounded-[12px] bg-paper px-3 py-2 text-sm"
                  >
                    <span className="font-medium">{DAYS[s.day]?.long}</span>
                    <span className="font-mono text-ink-soft tabular-nums">
                      {formatTimeRange(s.startTime, s.endTime)}
                      {s.room ? ` · ${s.room}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg">Cortes y actividades</h2>
              <Button size="sm" variant="ink" onClick={() => setActOpen(true)}>
                <Plus className="size-3.5" />
                Actividad
              </Button>
            </div>
            <div className="flex flex-col gap-6">
              {byCorte.map(({ window, grade, items }) => (
                <section key={window.index}>
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-ink">{window.name}</h3>
                      <p className="text-xs text-ink-faint">
                        {formatLongDate(window.startDate)} – {formatLongDate(window.endDate)} · {window.weight}%
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-[11px]">Nota del corte</Label>
                      <Input
                        className="h-8 w-20 text-center tabular-nums"
                        type="number"
                        min={0}
                        max={settings.gradeMax}
                        step={settings.gradeMax === 100 ? 1 : 0.1}
                        placeholder={grade == null ? "—" : formatGrade(grade, settings.gradeMax)}
                        defaultValue={
                          course.cortes.find((c) => c.index === window.index)?.grade ?? ""
                        }
                        key={`${course.id}-${window.index}-${course.cortes.find((c) => c.index === window.index)?.grade ?? "x"}`}
                        onBlur={(e) => {
                          const raw = e.target.value;
                          const next = raw === "" ? null : Number(raw);
                          updateCourse(course.id, {
                            cortes: course.cortes.map((c) =>
                              c.index === window.index ? { ...c, grade: next } : c,
                            ),
                          });
                        }}
                      />
                    </div>
                  </div>
                  {items.length === 0 ? (
                    <p className="px-2 text-sm text-ink-faint">Sin actividades en este corte.</p>
                  ) : (
                    items.map((a) => (
                      <div key={a.id} className="group relative">
                        <TaskRow activity={a} onToggle={toggleActivity} />
                        <div className="absolute top-2 right-2 hidden items-center gap-1 group-hover:flex">
                          {a.grade != null ? (
                            <GradeChip
                              value={a.grade}
                              max={settings.gradeMax}
                              passing={settings.passingGrade}
                            />
                          ) : null}
                          <button
                            type="button"
                            className="size-8 rounded-[8px] text-ink-faint hover:bg-paper-3 hover:text-danger"
                            aria-label="Eliminar actividad"
                            onClick={() => deleteActivity(a.id)}
                          >
                            <Trash2 className="mx-auto size-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </section>
              ))}
            </div>
          </Panel>
        </div>

        <div className="flex flex-col gap-4">
          <Panel>
            <h2 className="mb-3 font-display text-lg">Nota final</h2>
            <GradeMeter
              value={final}
              max={settings.gradeMax}
              passing={settings.passingGrade}
              size={88}
              label="Promedio ponderado de cortes"
            />
            <Separator className="my-4" />
            <Label className="mb-1.5 block">Sobrescribir nota final</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                min={0}
                max={settings.gradeMax}
                step={settings.gradeMax === 100 ? 1 : 0.1}
                placeholder="Auto"
                value={finalDraft}
                onChange={(e) => setFinalDraft(e.target.value)}
              />
              <Button
                variant="outline"
                onClick={() => {
                  const next = finalDraft === "" ? null : Number(finalDraft);
                  updateCourse(course.id, { finalGrade: next });
                  toast.success(next == null ? "Volvió al cálculo automático" : "Nota final guardada");
                }}
              >
                Guardar
              </Button>
            </div>
            <p className="mt-2 text-xs text-ink-faint">
              Si la dejas vacía, Aula calcula con los pesos de cada corte.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              {byCorte.map(({ window, grade }) => (
                <div key={window.index} className="flex items-center justify-between text-sm">
                  <span className="text-ink-soft">
                    {window.name}
                    <span className="ml-1 text-xs text-ink-faint">({window.weight}%)</span>
                  </span>
                  <span
                    className={cn(
                      "font-mono tabular-nums",
                      grade == null ? "text-ink-faint" : "text-ink",
                    )}
                  >
                    {formatGrade(grade, settings.gradeMax)}
                  </span>
                </div>
              ))}
            </div>
          </Panel>

          {course.notes ? (
            <Panel>
              <h2 className="mb-2 font-display text-lg">Notas</h2>
              <p className="whitespace-pre-wrap text-sm text-ink-soft">{course.notes}</p>
            </Panel>
          ) : null}
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar materia</DialogTitle>
            <DialogDescription>Horario, fechas y datos del módulo.</DialogDescription>
          </DialogHeader>
          {semester ? (
            <CourseForm
              semester={semester}
              initial={course}
              submitLabel="Guardar cambios"
              onCancel={() => setEditOpen(false)}
              onSubmit={(values) => {
                updateCourse(course.id, buildCourseFromForm(values, semester, course));
                toast.success("Materia actualizada");
                setEditOpen(false);
              }}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={actOpen} onOpenChange={setActOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva actividad</DialogTitle>
            <DialogDescription>Fecha de entrega y corte al que pertenece.</DialogDescription>
          </DialogHeader>
          <ActivityForm
            courses={[course]}
            semester={semester}
            defaultCourseId={course.id}
            submitLabel="Agregar"
            onCancel={() => setActOpen(false)}
            onSubmit={(v) => {
              addActivity(v);
              toast.success("Actividad agregada");
              setActOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Borrar {course.name}?</DialogTitle>
            <DialogDescription>
              Se eliminan también sus actividades. Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                deleteCourse(course.id);
                toast.success("Materia eliminada");
                void navigate({ to: "/materias" });
              }}
            >
              Borrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
