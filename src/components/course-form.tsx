import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, NativeSelect, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Course, PeriodType, ScheduleSlot, Semester } from "@/lib/types";
import { COURSE_COLORS, DAYS } from "@/lib/types";
import { uid } from "@/lib/utils";
import { useAcademicStore } from "@/lib/store";
import { inferCorteIndex } from "@/lib/academic";

interface SlotDraft {
  key: string;
  day: number;
  startTime: string;
  endTime: string;
  room: string;
}

interface ActivityDraft {
  key: string;
  name: string;
  dueDate: string;
}

export interface CourseFormValues {
  name: string;
  code: string;
  professor: string;
  color: string;
  type: PeriodType;
  startDate: string;
  endDate: string;
  credits: number;
  notes: string;
  schedule: ScheduleSlot[];
  activities: Array<{ name: string; dueDate: string }>;
}

const emptySlot = (): SlotDraft => ({
  key: uid(),
  day: 0,
  startTime: "08:00",
  endTime: "10:00",
  room: "",
});

export function CourseForm({
  semester,
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  semester: Semester;
  initial?: Course;
  submitLabel: string;
  onSubmit: (values: CourseFormValues) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [code, setCode] = useState(initial?.code ?? "");
  const [professor, setProfessor] = useState(initial?.professor ?? "");
  const [color, setColor] = useState(initial?.color ?? COURSE_COLORS[0]);
  const [type, setType] = useState<PeriodType>(initial?.type ?? semester.type);
  const [startDate, setStartDate] = useState(initial?.startDate ?? semester.startDate);
  const [endDate, setEndDate] = useState(initial?.endDate ?? semester.endDate);
  const [credits, setCredits] = useState(String(initial?.credits ?? 3));
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [slots, setSlots] = useState<SlotDraft[]>(
    initial?.schedule.length
      ? initial.schedule.map((s) => ({
          key: s.id,
          day: s.day,
          startTime: s.startTime,
          endTime: s.endTime,
          room: s.room,
        }))
      : [emptySlot()],
  );
  const [acts, setActs] = useState<ActivityDraft[]>(
    initial
      ? []
      : [{ key: uid(), name: "", dueDate: "" }],
  );

  const allCourses = useAcademicStore((s) => s.courses);
  const usedColors = useMemo(() => allCourses.map((c) => c.color), [allCourses]);
  const suggested = useMemo(() => {
    return COURSE_COLORS.find((c) => !usedColors.includes(c)) ?? COURSE_COLORS[0];
  }, [usedColors]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Ponle nombre al módulo o clase.");
      return;
    }
    const schedule: ScheduleSlot[] = slots
      .filter((s) => s.startTime && s.endTime)
      .map((s) => ({
        id: uid(),
        day: Number(s.day),
        startTime: s.startTime,
        endTime: s.endTime,
        room: s.room.trim(),
      }));
    const activities = acts
      .filter((a) => a.name.trim() && a.dueDate)
      .map((a) => ({ name: a.name.trim(), dueDate: a.dueDate }));
    onSubmit({
      name: name.trim(),
      code: code.trim(),
      professor: professor.trim(),
      color: color || suggested,
      type,
      startDate,
      endDate,
      credits: Math.max(0, Number(credits) || 0),
      notes: notes.trim(),
      schedule,
      activities,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Módulo / clase" className="sm:col-span-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Cálculo Integral"
            autoFocus
          />
        </Field>
        <Field label="Código">
          <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="MAT-204" />
        </Field>
        <Field label="Profesor">
          <Input
            value={professor}
            onChange={(e) => setProfessor(e.target.value)}
            placeholder="Nombre del docente"
          />
        </Field>
        <Field label="Tipo de clase">
          <NativeSelect value={type} onChange={(e) => setType(e.target.value as PeriodType)}>
            <option value="semestral">Semestral</option>
            <option value="trimestral">Trimestral</option>
          </NativeSelect>
        </Field>
        <Field label="Créditos">
          <Input
            type="number"
            min={0}
            max={20}
            step={1}
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
          />
        </Field>
        <Field label="Fecha de inicio">
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </Field>
        <Field label="Fecha final">
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </Field>
      </div>

      <div>
        <Label>Color en el horario</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {COURSE_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`Color ${c}`}
              onClick={() => setColor(c)}
              className="size-7 rounded-full transition-transform duration-150"
              style={{
                background: c,
                boxShadow: color === c ? `0 0 0 2px var(--color-paper), 0 0 0 4px ${c}` : undefined,
                transform: color === c ? "scale(1.08)" : undefined,
              }}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <Label>Horario</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setSlots((s) => [...s, emptySlot()])}
          >
            <Plus className="size-3.5" />
            Bloque
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          {slots.map((slot) => (
            <div key={slot.key} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 sm:grid-cols-[7rem_1fr_1fr_7rem_auto]">
              <NativeSelect
                value={slot.day}
                onChange={(e) =>
                  setSlots((all) =>
                    all.map((x) => (x.key === slot.key ? { ...x, day: Number(e.target.value) } : x)),
                  )
                }
              >
                {DAYS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.short}
                  </option>
                ))}
              </NativeSelect>
              <Input
                type="time"
                value={slot.startTime}
                onChange={(e) =>
                  setSlots((all) =>
                    all.map((x) => (x.key === slot.key ? { ...x, startTime: e.target.value } : x)),
                  )
                }
              />
              <Input
                type="time"
                value={slot.endTime}
                onChange={(e) =>
                  setSlots((all) =>
                    all.map((x) => (x.key === slot.key ? { ...x, endTime: e.target.value } : x)),
                  )
                }
              />
              <Input
                className="col-span-3 sm:col-span-1"
                placeholder="Salón"
                value={slot.room}
                onChange={(e) =>
                  setSlots((all) =>
                    all.map((x) => (x.key === slot.key ? { ...x, room: e.target.value } : x)),
                  )
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-ink-soft hover:text-danger"
                onClick={() => setSlots((all) => all.filter((x) => x.key !== slot.key))}
                aria-label="Quitar bloque"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {!initial ? (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <Label>Actividades (fecha de entrega)</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setActs((a) => [...a, { key: uid(), name: "", dueDate: "" }])}
            >
              <Plus className="size-3.5" />
              Actividad
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            {acts.map((act, i) => (
              <div key={act.key} className="grid grid-cols-[1fr_8.5rem_auto] gap-2">
                <Input
                  placeholder={`Actividad ${i + 1}`}
                  value={act.name}
                  onChange={(e) =>
                    setActs((all) =>
                      all.map((x) => (x.key === act.key ? { ...x, name: e.target.value } : x)),
                    )
                  }
                />
                <Input
                  type="date"
                  value={act.dueDate}
                  onChange={(e) =>
                    setActs((all) =>
                      all.map((x) => (x.key === act.key ? { ...x, dueDate: e.target.value } : x)),
                    )
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-ink-soft hover:text-danger"
                  onClick={() => setActs((all) => all.filter((x) => x.key !== act.key))}
                  aria-label="Quitar actividad"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <Field label="Notas">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Observaciones, enlaces del aula virtual…"
          rows={2}
        />
      </Field>

      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="ink">
          {submitLabel}
        </Button>
      </div>
    </form>
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

export function buildCourseFromForm(
  values: CourseFormValues,
  semester: Semester,
  existing?: Course,
): Course {
  return {
    id: existing?.id ?? uid(),
    semesterId: existing?.semesterId ?? semester.id,
    name: values.name,
    code: values.code,
    professor: values.professor,
    color: values.color,
    type: values.type,
    startDate: values.startDate,
    endDate: values.endDate,
    credits: values.credits,
    schedule: values.schedule,
    cortes:
      existing?.cortes ??
      semester.cortes.map((c) => ({ index: c.index, grade: null })),
    finalGrade: existing?.finalGrade ?? null,
    notes: values.notes,
  };
}

export function activitiesFromForm(
  values: CourseFormValues,
  courseId: string,
  semester: Semester,
) {
  return values.activities.map((a) => ({
    courseId,
    name: a.name,
    description: "",
    dueDate: a.dueDate,
    done: false,
    corteIndex: inferCorteIndex(a.dueDate, semester),
    grade: null as number | null,
  }));
}
