import { i as __toESM } from "../_runtime.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Plus, l as Clock3 } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as Button, o as useAcademicStore, r as PageHeader, s as useActiveSemester, u as computedFinalGrade, y as formatTimeRange } from "./router-CLkn-OOS.mjs";
import { n as DAYS } from "./types-CmQeLfnc.mjs";
import { t as GradeChip } from "./grade-meter-CLwWzOT9.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogDescription, t as Dialog } from "./label-C-cbMt7J.mjs";
import { t as Badge } from "./badge-DTDLpdUk.mjs";
import { n as activitiesFromForm, r as buildCourseFromForm, t as CourseForm } from "./course-form-D1oFS48g.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/materias-DaOK8s3K.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MateriasPage() {
	const [localOpen, setLocalOpen] = (0, import_react.useState)(false);
	const newCourseOpen = useAcademicStore((s) => s.newCourseOpen);
	const setNewCourseOpen = useAcademicStore((s) => s.setNewCourseOpen);
	const semester = useActiveSemester();
	const courses = useAcademicStore((s) => semester ? s.courses.filter((c) => c.semesterId === semester.id) : s.courses);
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Módulos",
			title: "Materias",
			description: "Cada clase con su horario, tipo de periodo, actividades y nota final.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ink",
				onClick: openDialog,
				disabled: !semester,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Nueva materia"]
			})
		}),
		!semester ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-ink-soft",
			children: "Crea un periodo académico primero."
		}) : courses.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-[24px] bg-paper-2 px-6 py-14 text-center shadow-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xl text-ink",
					children: "Todavía no hay materias"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-2 max-w-sm text-sm text-ink-soft",
					children: "Agrega el módulo, el horario, las fechas y las actividades — igual que en tu hoja de cálculo."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-5",
					variant: "ink",
					onClick: openDialog,
					children: "Registrar materia"
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "grid gap-3 sm:grid-cols-2",
			children: courses.map((c) => {
				const g = computedFinalGrade(c, activities, semester, settings.gradeMax);
				const pending = activities.filter((a) => a.courseId === c.id && !a.done).length;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/materias/$id",
					params: { id: c.id },
					className: "flex h-full flex-col rounded-[24px] bg-paper-2 p-4 shadow-card transition-[box-shadow,transform] duration-150 hover:shadow-card-hover active:scale-[0.995] sm:p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex min-w-0 items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-0.5 size-9 shrink-0 rounded-[10px]",
									style: { background: c.color }
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-lg leading-tight text-ink",
										children: c.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 truncate text-xs text-ink-soft",
										children: [c.code, c.professor].filter(Boolean).join(" · ") || "Sin código"
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradeChip, {
								value: g,
								max: settings.gradeMax,
								passing: settings.passingGrade
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 flex items-start gap-2 text-xs text-ink-soft",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { className: "mt-0.5 size-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.schedule.length === 0 ? "Sin horario cargado" : c.schedule.map((s) => `${DAYS[s.day]?.short} ${formatTimeRange(s.startTime, s.endTime)}`).join(" · ") })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-wrap gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: c.type }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: [c.credits, " cr."] }),
								pending > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									tone: "warn",
									children: [pending, " pendientes"]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: "success",
									children: "Al día"
								})
							]
						})
					]
				}) }, c.id);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: dialogOpen,
			onOpenChange: (v) => v ? openDialog() : closeDialog(),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-2xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Registrar materia" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Módulo, horario, fecha de inicio y final, tipo de clase y actividades." })] }), semester ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CourseForm, {
					semester,
					submitLabel: "Guardar materia",
					onCancel: closeDialog,
					onSubmit: (values) => {
						const course = buildCourseFromForm(values, semester);
						addCourse(course);
						for (const a of activitiesFromForm(values, course.id, semester)) addActivity(a);
						toast.success(`${course.name} quedó en el periodo`);
						closeDialog();
					}
				}) : null]
			})
		})
	] });
}
//#endregion
export { MateriasPage as component };
