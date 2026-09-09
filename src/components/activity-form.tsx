import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, NativeSelect, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Activity, Course, Semester } from "@/lib/types";
import { inferCorteIndex } from "@/lib/academic";
import { toISODate } from "@/lib/dates";

export function ActivityForm({
  courses,
  semester,
  initial,
  defaultCourseId,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  courses: Course[];
  semester?: Semester;
  initial?: Activity;
  defaultCourseId?: string;
  submitLabel: string;
  onSubmit: (values: {
    courseId: string;
    name: string;
    description: string;
    dueDate: string;
    corteIndex: number;
    grade: number | null;
  }) => void;
  onCancel: () => void;
}) {
  const [courseId, setCourseId] = useState(initial?.courseId ?? defaultCourseId ?? courses[0]?.id ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? toISODate(new Date()));
  const [corteIndex, setCorteIndex] = useState<number>(
    initial?.corteIndex ?? inferCorteIndex(initial?.dueDate ?? toISODate(new Date()), semester),
  );
  const [grade, setGrade] = useState(initial?.grade != null ? String(initial.grade) : "");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("La actividad necesita un nombre.");
      return;
    }
    if (!courseId) {
      toast.error("Elige una materia.");
      return;
    }
    onSubmit({
      courseId,
      name: name.trim(),
      description: description.trim(),
      dueDate,
      corteIndex: Number(corteIndex),
      grade: grade === "" ? null : Number(grade),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <Label className="mb-1.5 block">Materia</Label>
        <NativeSelect value={courseId} onChange={(e) => setCourseId(e.target.value)}>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </NativeSelect>
      </div>
      <div>
        <Label className="mb-1.5 block">Actividad</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Taller 3, quiz, parcial…"
          autoFocus
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="mb-1.5 block">Fecha de entrega</Label>
          <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
        <div>
          <Label className="mb-1.5 block">Corte</Label>
          <NativeSelect
            value={corteIndex}
            onChange={(e) => setCorteIndex(Number(e.target.value))}
          >
            {(semester?.cortes ?? [{ index: 0, name: "Corte 1" }]).map((c) => (
              <option key={c.index} value={c.index}>
                {c.name}
              </option>
            ))}
          </NativeSelect>
        </div>
      </div>
      <div>
        <Label className="mb-1.5 block">Nota (opcional)</Label>
        <Input
          type="number"
          inputMode="decimal"
          step="0.1"
          min={0}
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          placeholder="Vacío si aún no califica"
        />
      </div>
      <div>
        <Label className="mb-1.5 block">Detalle</Label>
        <Textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Qué hay que entregar"
        />
      </div>
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
