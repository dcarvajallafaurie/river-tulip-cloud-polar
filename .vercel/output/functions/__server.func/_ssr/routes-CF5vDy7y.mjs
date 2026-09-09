import { i as __toESM } from "../_runtime.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Plus, u as ChevronRight } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { E as toISODate, S as jsDayToSlot, _ as dueState, a as Button, b as formatTodayHeading, d as currentCorte, g as semesterAverage, h as progressThrough, i as Panel, o as useAcademicStore, r as PageHeader, s as useActiveSemester, u as computedFinalGrade } from "./router-CLkn-OOS.mjs";
import { n as WeekGrid, t as TodayTimeline } from "./week-grid-Gykq90y1.mjs";
import { n as GradeMeter } from "./grade-meter-CLwWzOT9.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogDescription, t as Dialog } from "./label-C-cbMt7J.mjs";
import { i as sortActivities, n as TaskGroup, r as TaskRow, t as ActivityForm } from "./activity-form-DFpZ4oFH.mjs";
import { t as Progress } from "./progress-CIyK2xv-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CF5vDy7y.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const semester = useActiveSemester();
	const courses = useAcademicStore((s) => semester ? s.courses.filter((c) => c.semesterId === semester.id) : s.courses);
	const activities = useAcademicStore((s) => s.activities);
	const settings = useAcademicStore((s) => s.settings);
	const toggleActivity = useAcademicStore((s) => s.toggleActivity);
	const addActivity = useAcademicStore((s) => s.addActivity);
	const [open, setOpen] = (0, import_react.useState)(false);
	const todayISO = toISODate(/* @__PURE__ */ new Date());
	const corte = currentCorte(semester, todayISO);
	const avg = semesterAverage(courses, activities, semester, settings.gradeMax);
	const todaySlot = jsDayToSlot((/* @__PURE__ */ new Date()).getDay());
	const classesToday = todaySlot == null ? 0 : courses.reduce((n, c) => n + c.schedule.filter((s) => s.day === todaySlot).length, 0);
	const pending = (0, import_react.useMemo)(() => {
		const mine = activities.filter((a) => courses.some((c) => c.id === a.courseId));
		return sortActivities(mine.filter((a) => !a.done));
	}, [activities, courses]);
	const overdue = pending.filter((a) => dueState(a.dueDate, false) === "overdue");
	const today = pending.filter((a) => dueState(a.dueDate, false) === "today");
	const soon = pending.filter((a) => {
		const st = dueState(a.dueDate, false);
		return st === "soon" || st === "later";
	});
	const dashboardTasks = [
		...overdue,
		...today,
		...soon
	].slice(0, 8);
	const progress = semester ? progressThrough(semester.startDate, semester.endDate, todayISO) : 0;
	const corteProgress = corte ? progressThrough(corte.startDate, corte.endDate, todayISO) : 0;
	const courseById = (0, import_react.useMemo)(() => Object.fromEntries(courses.map((c) => [c.id, c])), [courses]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: semester ? `${semester.name} · ${semester.type}` : "Aula",
			title: formatTodayHeading(),
			description: "Horario de la semana, clases de hoy y las tareas que no puedes dejar pasar.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ink",
				onClick: () => setOpen(true),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Nueva tarea"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Promedio",
					value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradeMeter, {
						value: avg,
						max: settings.gradeMax,
						passing: settings.passingGrade,
						size: 64
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Tareas abiertas",
					value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl tabular-nums text-ink",
						children: pending.length
					}),
					hint: overdue.length ? `${overdue.length} vencidas` : "Al día",
					hintTone: overdue.length ? "danger" : "ok"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Clases hoy",
					value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl tabular-nums text-ink",
						children: classesToday
					}),
					hint: todaySlot == null ? "Domingo" : void 0
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: corte ? corte.name : "Periodo",
					value: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-display text-3xl tabular-nums text-ink",
							children: [Math.round((corte ? corteProgress : progress) * 100), "%"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
							className: "mt-2",
							value: (corte ? corteProgress : progress) * 100
						})]
					}),
					hint: semester ? `${Math.round(progress * 100)}% del ${semester.type === "semestral" ? "semestre" : "trimestre"}` : void 0
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg text-ink",
					children: "Horario de la semana"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "ghost",
					size: "sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/horario",
						children: ["Ver horario", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-3.5" })]
					})
				})]
			}), courses.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
				hint: "Agrega una materia para ver el horario.",
				to: "/materias"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeekGrid, {
				courses,
				anchor: /* @__PURE__ */ new Date(),
				compact: true
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 font-display text-lg text-ink",
					children: "Hoy"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TodayTimeline, { courses })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg text-ink",
						children: "Tareas"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "ghost",
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/tareas",
							children: ["Todas", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-3.5" })]
						})
					})]
				}), dashboardTasks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-ink-soft",
					children: "No hay pendientes. Respira."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "-mx-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskGroup, {
							title: "Vencidas",
							count: overdue.length,
							children: overdue.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskRow, {
								activity: a,
								course: courseById[a.courseId],
								onToggle: toggleActivity,
								compact: true
							}, a.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskGroup, {
							title: "Hoy",
							count: today.length,
							children: today.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskRow, {
								activity: a,
								course: courseById[a.courseId],
								onToggle: toggleActivity,
								compact: true
							}, a.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskGroup, {
							title: "Próximas",
							count: soon.slice(0, 5).length,
							children: soon.slice(0, 5).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskRow, {
								activity: a,
								course: courseById[a.courseId],
								onToggle: toggleActivity,
								compact: true
							}, a.id))
						})
					]
				})] })]
			})]
		}),
		courses.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
			children: courses.map((c) => {
				const g = computedFinalGrade(c, activities, semester, settings.gradeMax);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/materias/$id",
					params: { id: c.id },
					className: "flex items-center gap-3 rounded-[20px] bg-paper-2 p-3 shadow-card transition-[box-shadow,transform] duration-150 hover:shadow-card-hover active:scale-[0.99]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "size-9 shrink-0 rounded-[10px]",
							style: { background: c.color }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate font-medium text-ink",
								children: c.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-xs text-ink-soft",
								children: c.code || c.professor || c.type
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-sm tabular-nums text-ink",
							children: g == null ? "—" : g.toFixed(settings.gradeMax === 100 ? 0 : 1)
						})
					]
				}, c.id);
			})
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Nueva tarea" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Queda en el tablero hasta que la marques como hecha." })] }), courses.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-ink-soft",
				children: "Primero crea una materia."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityForm, {
				courses,
				semester,
				submitLabel: "Agregar",
				onCancel: () => setOpen(false),
				onSubmit: (v) => {
					addActivity(v);
					toast.success("Tarea agregada");
					setOpen(false);
				}
			})] })
		})
	] });
}
function Stat({ label, value, hint, hintTone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[20px] bg-paper-2 p-4 shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-semibold uppercase tracking-wider text-ink-faint",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex min-h-12 items-center",
				children: value
			}),
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: hintTone === "danger" ? "mt-1 text-xs text-danger" : "mt-1 text-xs text-ink-soft",
				children: hint
			}) : null
		]
	});
}
function Empty({ hint, to }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-start gap-3 py-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-ink-soft",
			children: hint
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			variant: "ink",
			size: "sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to,
				children: "Agregar materia"
			})
		})]
	});
}
//#endregion
export { Home as component };
