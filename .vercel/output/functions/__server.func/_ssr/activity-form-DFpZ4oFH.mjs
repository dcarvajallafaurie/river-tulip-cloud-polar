import { i as __toESM } from "../_runtime.mjs";
import { m as require_react, n as CheckboxIndicator, p as require_jsx_runtime, t as Checkbox$1 } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as Check } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { E as toISODate, O as cn, _ as dueState, a as Button, m as inferCorteIndex, x as formatWeekdayDate } from "./router-CLkn-OOS.mjs";
import { c as NativeSelect, l as Textarea, o as Input, s as Label } from "./label-C-cbMt7J.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/activity-form-DFpZ4oFH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Checkbox = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox$1, {
	ref,
	className: cn("peer relative size-5 shrink-0 rounded-[5px] bg-paper-2 shadow-[var(--shadow-border)] transition-colors duration-150", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35", "data-[state=checked]:bg-accent data-[state=checked]:text-accent-fg data-[state=checked]:shadow-none", "after:absolute after:top-1/2 after:left-1/2 after:size-11 after:-translate-x-1/2 after:-translate-y-1/2 after:content-['']", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxIndicator, {
		className: "flex items-center justify-center text-current",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
			className: "size-3.5",
			strokeWidth: 2.6
		})
	})
}));
Checkbox.displayName = "Checkbox";
var DUE_LABEL = {
	done: "Hecha",
	overdue: "Vencida",
	today: "Hoy",
	soon: "Pronto",
	later: ""
};
function TaskRow({ activity, course, onToggle, compact }) {
	const state = dueState(activity.dueDate, activity.done);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("group flex items-start gap-3 rounded-[14px] px-2 py-2 transition-colors duration-150 hover:bg-paper-2", activity.done && "opacity-60"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
			checked: activity.done,
			onCheckedChange: () => onToggle(activity.id),
			"aria-label": activity.done ? "Marcar como pendiente" : "Marcar como hecha",
			className: "mt-0.5"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cn("text-sm font-medium text-ink", activity.done && "line-through decoration-ink-faint"),
					children: activity.name
				}), state === "overdue" || state === "today" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide", state === "overdue" && "bg-danger/12 text-danger", state === "today" && "bg-accent/12 text-accent"),
					children: DUE_LABEL[state]
				}) : null]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-ink-soft",
				children: [
					course ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/materias/$id",
						params: { id: course.id },
						className: "inline-flex items-center gap-1.5 hover:text-ink",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "size-1.5 rounded-full",
							style: { background: course.color }
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: course.name
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums",
						children: formatWeekdayDate(activity.dueDate)
					}),
					!compact && activity.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "hidden truncate sm:inline",
						children: ["· ", activity.description]
					}) : null
				]
			})]
		})]
	});
}
function TaskGroup({ title, count, children }) {
	if (count === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-col gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-baseline justify-between px-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-[11px] font-semibold uppercase tracking-wider text-ink-faint",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-[11px] text-ink-faint tabular-nums",
				children: count
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children })]
	});
}
function sortActivities(list) {
	return [...list].sort((a, b) => {
		if (a.done !== b.done) return a.done ? 1 : -1;
		return a.dueDate.localeCompare(b.dueDate);
	});
}
function ActivityForm({ courses, semester, initial, defaultCourseId, submitLabel, onSubmit, onCancel }) {
	const [courseId, setCourseId] = (0, import_react.useState)(initial?.courseId ?? defaultCourseId ?? courses[0]?.id ?? "");
	const [name, setName] = (0, import_react.useState)(initial?.name ?? "");
	const [description, setDescription] = (0, import_react.useState)(initial?.description ?? "");
	const [dueDate, setDueDate] = (0, import_react.useState)(initial?.dueDate ?? toISODate(/* @__PURE__ */ new Date()));
	const [corteIndex, setCorteIndex] = (0, import_react.useState)(initial?.corteIndex ?? inferCorteIndex(initial?.dueDate ?? toISODate(/* @__PURE__ */ new Date()), semester));
	const [grade, setGrade] = (0, import_react.useState)(initial?.grade != null ? String(initial.grade) : "");
	function handleSubmit(e) {
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
			grade: grade === "" ? null : Number(grade)
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSubmit,
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				className: "mb-1.5 block",
				children: "Materia"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
				value: courseId,
				onChange: (e) => setCourseId(e.target.value),
				children: courses.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: c.id,
					children: c.name
				}, c.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				className: "mb-1.5 block",
				children: "Actividad"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: name,
				onChange: (e) => setName(e.target.value),
				placeholder: "Taller 3, quiz, parcial…",
				autoFocus: true
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "mb-1.5 block",
					children: "Fecha de entrega"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "date",
					value: dueDate,
					onChange: (e) => setDueDate(e.target.value)
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "mb-1.5 block",
					children: "Corte"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
					value: corteIndex,
					onChange: (e) => setCorteIndex(Number(e.target.value)),
					children: (semester?.cortes ?? [{
						index: 0,
						name: "Corte 1"
					}]).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: c.index,
						children: c.name
					}, c.index))
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				className: "mb-1.5 block",
				children: "Nota (opcional)"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				type: "number",
				inputMode: "decimal",
				step: "0.1",
				min: 0,
				value: grade,
				onChange: (e) => setGrade(e.target.value),
				placeholder: "Vacío si aún no califica"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				className: "mb-1.5 block",
				children: "Detalle"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				rows: 2,
				value: description,
				onChange: (e) => setDescription(e.target.value),
				placeholder: "Qué hay que entregar"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-end gap-2 pt-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					onClick: onCancel,
					children: "Cancelar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					variant: "ink",
					children: submitLabel
				})]
			})
		]
	});
}
//#endregion
export { sortActivities as i, TaskGroup as n, TaskRow as r, ActivityForm as t };
