import { i as __toESM } from "../_runtime.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as Plus, r as Trash2 } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as Button, k as uid, m as inferCorteIndex, o as useAcademicStore } from "./router-CLkn-OOS.mjs";
import { n as DAYS, t as COURSE_COLORS } from "./types-CmQeLfnc.mjs";
import { c as NativeSelect, l as Textarea, o as Input, s as Label } from "./label-C-cbMt7J.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/course-form-D1oFS48g.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var emptySlot = () => ({
	key: uid(),
	day: 0,
	startTime: "08:00",
	endTime: "10:00",
	room: ""
});
function CourseForm({ semester, initial, submitLabel, onSubmit, onCancel }) {
	const [name, setName] = (0, import_react.useState)(initial?.name ?? "");
	const [code, setCode] = (0, import_react.useState)(initial?.code ?? "");
	const [professor, setProfessor] = (0, import_react.useState)(initial?.professor ?? "");
	const [color, setColor] = (0, import_react.useState)(initial?.color ?? COURSE_COLORS[0]);
	const [type, setType] = (0, import_react.useState)(initial?.type ?? semester.type);
	const [startDate, setStartDate] = (0, import_react.useState)(initial?.startDate ?? semester.startDate);
	const [endDate, setEndDate] = (0, import_react.useState)(initial?.endDate ?? semester.endDate);
	const [credits, setCredits] = (0, import_react.useState)(String(initial?.credits ?? 3));
	const [notes, setNotes] = (0, import_react.useState)(initial?.notes ?? "");
	const [slots, setSlots] = (0, import_react.useState)(initial?.schedule.length ? initial.schedule.map((s) => ({
		key: s.id,
		day: s.day,
		startTime: s.startTime,
		endTime: s.endTime,
		room: s.room
	})) : [emptySlot()]);
	const [acts, setActs] = (0, import_react.useState)(initial ? [] : [{
		key: uid(),
		name: "",
		dueDate: ""
	}]);
	const usedColors = useAcademicStore((s) => s.courses.map((c) => c.color));
	const suggested = (0, import_react.useMemo)(() => {
		return COURSE_COLORS.find((c) => !usedColors.includes(c)) ?? COURSE_COLORS[0];
	}, [usedColors]);
	function handleSubmit(e) {
		e.preventDefault();
		if (!name.trim()) {
			toast.error("Ponle nombre al módulo o clase.");
			return;
		}
		const schedule = slots.filter((s) => s.startTime && s.endTime).map((s) => ({
			id: uid(),
			day: Number(s.day),
			startTime: s.startTime,
			endTime: s.endTime,
			room: s.room.trim()
		}));
		const activities = acts.filter((a) => a.name.trim() && a.dueDate).map((a) => ({
			name: a.name.trim(),
			dueDate: a.dueDate
		}));
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
			activities
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSubmit,
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Módulo / clase",
						className: "sm:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: name,
							onChange: (e) => setName(e.target.value),
							placeholder: "Cálculo Integral",
							autoFocus: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Código",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: code,
							onChange: (e) => setCode(e.target.value),
							placeholder: "MAT-204"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Profesor",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: professor,
							onChange: (e) => setProfessor(e.target.value),
							placeholder: "Nombre del docente"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Tipo de clase",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
							value: type,
							onChange: (e) => setType(e.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "semestral",
								children: "Semestral"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "trimestral",
								children: "Trimestral"
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Créditos",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 0,
							max: 20,
							step: 1,
							value: credits,
							onChange: (e) => setCredits(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Fecha de inicio",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: startDate,
							onChange: (e) => setStartDate(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Fecha final",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: endDate,
							onChange: (e) => setEndDate(e.target.value)
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Color en el horario" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-wrap gap-2",
				children: COURSE_COLORS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": `Color ${c}`,
					onClick: () => setColor(c),
					className: "size-7 rounded-full transition-transform duration-150",
					style: {
						background: c,
						boxShadow: color === c ? `0 0 0 2px var(--color-paper), 0 0 0 4px ${c}` : void 0,
						transform: color === c ? "scale(1.08)" : void 0
					}
				}, c))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Horario" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "ghost",
					size: "sm",
					onClick: () => setSlots((s) => [...s, emptySlot()]),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), "Bloque"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-2",
				children: slots.map((slot) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[1fr_1fr_1fr_auto] gap-2 sm:grid-cols-[7rem_1fr_1fr_7rem_auto]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
							value: slot.day,
							onChange: (e) => setSlots((all) => all.map((x) => x.key === slot.key ? {
								...x,
								day: Number(e.target.value)
							} : x)),
							children: DAYS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: d.id,
								children: d.short
							}, d.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "time",
							value: slot.startTime,
							onChange: (e) => setSlots((all) => all.map((x) => x.key === slot.key ? {
								...x,
								startTime: e.target.value
							} : x))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "time",
							value: slot.endTime,
							onChange: (e) => setSlots((all) => all.map((x) => x.key === slot.key ? {
								...x,
								endTime: e.target.value
							} : x))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "col-span-3 sm:col-span-1",
							placeholder: "Salón",
							value: slot.room,
							onChange: (e) => setSlots((all) => all.map((x) => x.key === slot.key ? {
								...x,
								room: e.target.value
							} : x))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							size: "icon-sm",
							className: "text-ink-soft hover:text-danger",
							onClick: () => setSlots((all) => all.filter((x) => x.key !== slot.key)),
							"aria-label": "Quitar bloque",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
						})
					]
				}, slot.key))
			})] }),
			!initial ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Actividades (fecha de entrega)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "ghost",
					size: "sm",
					onClick: () => setActs((a) => [...a, {
						key: uid(),
						name: "",
						dueDate: ""
					}]),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), "Actividad"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-2",
				children: acts.map((act, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[1fr_8.5rem_auto] gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: `Actividad ${i + 1}`,
							value: act.name,
							onChange: (e) => setActs((all) => all.map((x) => x.key === act.key ? {
								...x,
								name: e.target.value
							} : x))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: act.dueDate,
							onChange: (e) => setActs((all) => all.map((x) => x.key === act.key ? {
								...x,
								dueDate: e.target.value
							} : x))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							size: "icon-sm",
							className: "text-ink-soft hover:text-danger",
							onClick: () => setActs((all) => all.filter((x) => x.key !== act.key)),
							"aria-label": "Quitar actividad",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
						})
					]
				}, act.key))
			})] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Notas",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: notes,
					onChange: (e) => setNotes(e.target.value),
					placeholder: "Observaciones, enlaces del aula virtual…",
					rows: 2
				})
			}),
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
function Field({ label, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "mb-1.5 block",
			children: label
		}), children]
	});
}
function buildCourseFromForm(values, semester, existing) {
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
		cortes: existing?.cortes ?? semester.cortes.map((c) => ({
			index: c.index,
			grade: null
		})),
		finalGrade: existing?.finalGrade ?? null,
		notes: values.notes
	};
}
function activitiesFromForm(values, courseId, semester) {
	return values.activities.map((a) => ({
		courseId,
		name: a.name,
		description: "",
		dueDate: a.dueDate,
		done: false,
		corteIndex: inferCorteIndex(a.dueDate, semester),
		grade: null
	}));
}
//#endregion
export { activitiesFromForm as n, buildCourseFromForm as r, CourseForm as t };
