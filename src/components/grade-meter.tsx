import { cn } from "@/lib/utils";
import { formatGrade, gradeTone } from "@/lib/academic";
import type { GradeScale } from "@/lib/types";

export function GradeMeter({
  value,
  max,
  passing,
  size = 72,
  label,
}: {
  value: number | null;
  max: GradeScale;
  passing: number;
  size?: number;
  label?: string;
}) {
  const tone = gradeTone(value, passing, max);
  const pct = value == null ? 0 : Math.min(1, Math.max(0, value / max));
  const r = 18;
  const c = 2 * Math.PI * r;
  const stroke =
    tone === "good"
      ? "var(--color-success)"
      : tone === "fail"
        ? "var(--color-danger)"
        : tone === "pass"
          ? "var(--color-accent)"
          : "var(--color-rule)";

  return (
    <div className="flex items-center gap-3">
      <svg width={size} height={size} viewBox="0 0 48 48" className="shrink-0">
        <circle
          cx="24"
          cy="24"
          r={r}
          fill="none"
          stroke="var(--color-paper-3)"
          strokeWidth="4"
        />
        <circle
          cx="24"
          cy="24"
          r={r}
          fill="none"
          stroke={stroke}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          transform="rotate(-90 24 24)"
        />
        <text
          x="24"
          y="24"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-ink"
          style={{ fontSize: 9, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}
        >
          {formatGrade(value, max)}
        </text>
      </svg>
      {label ? (
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-faint">{label}</p>
          <p
            className={cn(
              "text-sm font-medium",
              tone === "fail" && "text-danger",
              tone === "good" && "text-success",
            )}
          >
            {tone === "empty"
              ? "Sin nota"
              : tone === "fail"
                ? "En riesgo"
                : tone === "good"
                  ? "Sobresaliente"
                  : "Aprobando"}
          </p>
        </div>
      ) : null}
    </div>
  );
}

export function GradeChip({
  value,
  max,
  passing,
}: {
  value: number | null;
  max: GradeScale;
  passing: number;
}) {
  const tone = gradeTone(value, passing, max);
  return (
    <span
      className={cn(
        "inline-flex min-w-10 items-center justify-center rounded-full px-2 py-0.5 text-sm font-medium tabular-nums",
        tone === "empty" && "bg-paper-3 text-ink-faint",
        tone === "fail" && "bg-danger/12 text-danger",
        tone === "pass" && "bg-accent/12 text-accent",
        tone === "good" && "bg-success/12 text-success",
      )}
    >
      {formatGrade(value, max)}
    </span>
  );
}
