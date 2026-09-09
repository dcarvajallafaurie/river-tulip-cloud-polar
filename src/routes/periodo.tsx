import { useState, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Panel } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input, NativeSelect } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GradeChip, GradeMeter } from "@/components/grade-meter";
import { useAcademicStore, useActiveSemester } from "@/lib/store";
import type { CorteWindow, GradeScale, PeriodType, Semester } from "@/lib/types";
import {
  computedFinalGrade,
  formatGrade,
  progressThrough,
  semesterAverage,
} from "@/lib/academic";
import { formatLongDate, toISODate } from "@/lib/dates";

export const Route = createFileRoute("/periodo")({ component: PeriodoPage });

function PeriodoPage() {
  const semesters = useAcademicStore((s) => s.semesters);
  const courses = useAcademicStore((s) => s.courses);
  const activities = useAcademicStore((s) => s.activities);
  const settings = useAcademicStore((s) => s.settings);
  const updateSettings = useAcademicStore((s) => s.updateSettings);
  const updateSemester = useAcademicStore((s) => s.updateSemester);
  const addSemester = useAcademicStore((s) => s.addSemester);
  const deleteSemester = useAcademicStore((s) => s.deleteSemester);
  const setActiveSemester = useAcademicStore((s) => s.setActiveSemester);
  const resetToSeed = useAcademicStore((s) => s.resetToSeed);
  const clearAll = useAcademicStore((s) => s.clearAll);
  const semester = useActiveSemester();
  const [open, setOpen] = useState(false);

  const mine = courses.filter((c) => (semester ? c.semesterId === semester.id : true));
  const avg = semesterAverage(mine, activities, semester, settings.gradeMax);
  const today = toISODate(new Date());
  const progress = semester ? progressThrough(semester.startDate, semester.endDate, today) : 0;

  return (
    <div>
      <PageHeader
        kicker="Académico"
        title="Periodo y cortes"
        description="Define si el periodo es semestral o trimestral, los cortes y la escala de notas."
        actions={
          <Button variant="ink" onClick={() => setOpen(true)}>
            <Plus className="size-4" />
            Nuevo periodo
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {semesters.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveSemester(s.id)}
            className={
              s.isActive
                ? "rounded-full bg-ink px-3 py-1.5 text-sm text-paper"
                : "rounded-full bg-paper-3 px-3 py-1.5 text-sm text-ink-soft hover:text-ink"
            }
          >
            {s.name}
          </button>
        ))}
      </div>

      {semester ? (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="flex flex-col gap-4">
            <Panel>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl">{semester.name}</h2>
                  <p className="text-sm text-ink-soft">
                    {formatLongDate(semester.startDate)} – {formatLongDate(semester.endDate)}
                  </p>
                </div>
                <Badge>{semester.type}</Badge>
              </div>
              <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs text-ink-faint">
                  <span>Avance del periodo</span>
                  <span className="tabular-nums">{Math.round(progress * 100)}%</span>
                </div>
                <Progress value={progress * 100} />
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <Field label="Nombre">
                  <Input
                    defaultValue={semester.name}
                    onBlur={(e) => updateSemester(semester.id, { name: e.target.value })}
                  />
                </Field>
                <Field label="Tipo">
                  <NativeSelect
                    value={semester.type}
                    onChange={(e) =>
                      updateSemester(semester.id, { type: e.target.value as PeriodType })
                    }
                  >
                    <option value="semestral">Semestral</option>
                    <option value="trimestral">Trimestral</option>
                  </NativeSelect>
                </Field>
                <Field label=" ">
                  <Button
                    variant="ghost"
                    className="w-full text-danger hover:bg-danger/10"
                    onClick={() => {
                      if (semesters.length < 2) {
                        toast.error("Deja al menos un periodo.");
                        return;
                      }
                      deleteSemester(semester.id);
                      toast.success("Periodo eliminado");
                    }}
                  >
                    <Trash2 className="size-4" />
                    Eliminar periodo
                  </Button>
                </Field>
                <Field label="Inicio">
                  <Input
                    type="date"
                    defaultValue={semester.startDate}
                    onBlur={(e) => updateSemester(semester.id, { startDate: e.target.value })}
                  />
                </Field>
                <Field label="Fin">
                  <Input
                    type="date"
                    defaultValue={semester.endDate}
                    onBlur={(e) => updateSemester(semester.id, { endDate: e.target.value })}
                  />
                </Field>
              </div>
            </Panel>

            <Panel>
              <h2 className="mb-1 font-display text-lg">Cortes</h2>
              <p className="mb-4 text-sm text-ink-soft">
                Pesos que sumen 100. La nota final de cada materia se pondera con estos cortes.
              </p>
              <div className="flex flex-col gap-3">
                {semester.cortes.map((c, i) => (
                  <div
                    key={c.index}
                    className="grid grid-cols-2 gap-2 rounded-[16px] bg-paper p-3 sm:grid-cols-[1fr_1fr_1fr_5.5rem]"
                  >
                    <Field label="Nombre">
                      <Input
                        defaultValue={c.name}
                        onBlur={(e) =>
                          patchCorte(semester, i, { name: e.target.value }, updateSemester)
                        }
                      />
                    </Field>
                    <Field label="Inicio">
                      <Input
                        type="date"
                        defaultValue={c.startDate}
                        onBlur={(e) =>
                          patchCorte(semester, i, { startDate: e.target.value }, updateSemester)
                        }
                      />
                    </Field>
                    <Field label="Fin">
                      <Input
                        type="date"
                        defaultValue={c.endDate}
                        onBlur={(e) =>
                          patchCorte(semester, i, { endDate: e.target.value }, updateSemester)
                        }
                      />
                    </Field>
                    <Field label="Peso %">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        defaultValue={c.weight}
                        onBlur={(e) =>
                          patchCorte(
                            semester,
                            i,
                            { weight: Number(e.target.value) || 0 },
                            updateSemester,
                          )
                        }
                      />
                    </Field>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-ink-faint">
                Suma de pesos: {semester.cortes.reduce((s, c) => s + c.weight, 0)}%
              </p>
            </Panel>

            <Panel>
              <h2 className="mb-4 font-display text-lg">Notas del periodo</h2>
              {mine.length === 0 ? (
                <p className="text-sm text-ink-soft">Todavía no hay materias.</p>
              ) : (
                <ul className="flex flex-col">
                  {mine.map((c) => {
                    const g = computedFinalGrade(c, activities, semester, settings.gradeMax);
                    return (
                      <li key={c.id} className="border-b border-rule last:border-0">
                        <Link
                          to="/materias/$id"
                          params={{ id: c.id }}
                          className="flex items-center gap-3 py-3"
                        >
                          <span className="size-3 rounded-full" style={{ background: c.color }} />
                          <span className="min-w-0 flex-1 truncate font-medium">{c.name}</span>
                          <span className="text-xs text-ink-faint">{c.credits} cr.</span>
                          <GradeChip
                            value={g}
                            max={settings.gradeMax}
                            passing={settings.passingGrade}
                          />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Panel>
          </div>

          <div className="flex flex-col gap-4">
            <Panel>
              <h2 className="mb-3 font-display text-lg">Promedio ponderado</h2>
              <GradeMeter
                value={avg}
                max={settings.gradeMax}
                passing={settings.passingGrade}
                size={96}
                label={`Escala 0–${settings.gradeMax}`}
              />
              <p className="mt-3 text-sm text-ink-soft">
                {avg == null
                  ? "Carga notas de corte para ver el promedio."
                  : `Promedio ${formatGrade(avg, settings.gradeMax)} con ${mine.reduce((s, c) => s + c.credits, 0)} créditos.`}
              </p>
            </Panel>

            <Panel>
              <h2 className="mb-3 font-display text-lg">Escala</h2>
              <Field label="Nota máxima">
                <NativeSelect
                  value={settings.gradeMax}
                  onChange={(e) => {
                    const gradeMax = Number(e.target.value) as GradeScale;
                    const passing = gradeMax === 5 ? 3 : gradeMax === 10 ? 6 : 60;
                    updateSettings({ gradeMax, passingGrade: passing });
                  }}
                >
                  <option value={5}>0.0 – 5.0 (Colombia)</option>
                  <option value={10}>0 – 10</option>
                  <option value={100}>0 – 100</option>
                </NativeSelect>
              </Field>
              <Field label="Nota mínima para aprobar" className="mt-3">
                <Input
                  type="number"
                  min={0}
                  max={settings.gradeMax}
                  step={settings.gradeMax === 100 ? 1 : 0.1}
                  defaultValue={settings.passingGrade}
                  onBlur={(e) => updateSettings({ passingGrade: Number(e.target.value) })}
                />
              </Field>
              <Field label="Universidad (opcional)" className="mt-3">
                <Input
                  defaultValue={settings.university}
                  placeholder="Nombre de la universidad"
                  onBlur={(e) => updateSettings({ university: e.target.value })}
                />
              </Field>
            </Panel>

            <Panel>
              <h2 className="mb-2 font-display text-lg">Datos de ejemplo</h2>
              <p className="mb-4 text-sm text-ink-soft">
                Esta vista arranca con un semestre 2026-2 de muestra. Puedes reemplazarlo o
                vaciar todo.
              </p>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    resetToSeed();
                    toast.success("Se cargó el semestre de ejemplo");
                  }}
                >
                  Restaurar ejemplo
                </Button>
                <Button
                  variant="ghost"
                  className="text-danger hover:bg-danger/10"
                  onClick={() => {
                    clearAll();
                    toast.success("Tablero vacío. Crea un periodo para empezar.");
                  }}
                >
                  Borrar todo
                </Button>
              </div>
            </Panel>
          </div>
        </div>
      ) : (
        <Panel>
          <p className="text-sm text-ink-soft">No hay periodos. Crea el primero.</p>
        </Panel>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo periodo</DialogTitle>
            <DialogDescription>Semestre o trimestre, con tres cortes por defecto.</DialogDescription>
          </DialogHeader>
          <NewSemesterForm
            onCancel={() => setOpen(false)}
            onCreate={(s) => {
              addSemester(s);
              toast.success("Periodo creado");
              setOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block">{label}</Label>
      {children}
    </div>
  );
}

function patchCorte(
  semester: Semester,
  index: number,
  patch: Partial<CorteWindow>,
  updateSemester: (id: string, patch: Partial<Semester>) => void,
) {
  const cortes = semester.cortes.map((c, i) => (i === index ? { ...c, ...patch } : c));
  updateSemester(semester.id, { cortes });
}

function NewSemesterForm({
  onCreate,
  onCancel,
}: {
  onCreate: (s: Omit<Semester, "id">) => void;
  onCancel: () => void;
}) {
  const year = new Date().getFullYear();
  const [name, setName] = useState(`${year}-1`);
  const [type, setType] = useState<PeriodType>("semestral");
  const [startDate, setStartDate] = useState(`${year}-02-03`);
  const [endDate, setEndDate] = useState(`${year}-06-14`);

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        const cortes = defaultCortes(type, startDate, endDate);
        onCreate({ name, type, startDate, endDate, cortes, isActive: true });
      }}
    >
      <Field label="Nombre">
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="Tipo">
        <NativeSelect value={type} onChange={(e) => setType(e.target.value as PeriodType)}>
          <option value="semestral">Semestral</option>
          <option value="trimestral">Trimestral</option>
        </NativeSelect>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Inicio">
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </Field>
        <Field label="Fin">
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </Field>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="ink">
          Crear
        </Button>
      </div>
    </form>
  );
}

function defaultCortes(type: PeriodType, start: string, end: string): CorteWindow[] {
  const s = Date.parse(start);
  const e = Date.parse(end);
  const n = type === "trimestral" ? 2 : 3;
  const span = e - s;
  const weights = type === "trimestral" ? [50, 50] : [33, 33, 34];
  return Array.from({ length: n }, (_, i) => {
    const from = new Date(s + (span * i) / n);
    const to = new Date(s + (span * (i + 1)) / n);
    return {
      index: i,
      name: `Corte ${i + 1}`,
      startDate: toISODate(from),
      endDate: toISODate(to),
      weight: weights[i] ?? Math.round(100 / n),
    };
  });
}

