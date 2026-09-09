import { i as __toESM } from "../_runtime.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as Plus } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { O as cn, _ as dueState, a as Button, i as Panel, o as useAcademicStore, r as PageHeader, s as useActiveSemester } from "./router-CLkn-OOS.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogDescription, t as Dialog } from "./label-C-cbMt7J.mjs";
import { i as sortActivities, n as TaskGroup, r as TaskRow, t as ActivityForm } from "./activity-form-DFpZ4oFH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tareas-BbaH78MZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TareasPage() {
	const [filter, setFilter] = (0, import_react.useState)("pendientes");
	const [open, setOpen] = (0, import_react.useState)(false);
	const semester = useActiveSemester();
	const courses = useAcademicStore((s) => semester ? s.courses.filter((c) => c.semesterId === semester.id) : s.courses);
	const activities = useAcademicStore((s) => s.activities);
	const toggleActivity = useAcademicStore((s) => s.toggleActivity);
	const addActivity = useAcademicStore((s) => s.addActivity);
	const courseById = (0, import_react.useMemo)(() => Object.fromEntries(courses.map((c) => [c.id, c])), [courses]);
	const visible = (0, import_react.useMemo)(() => sortActivities(activities.filter((a) => courses.some((c) => c.id === a.courseId))), [activities, courses]).filter((a) => {
		if (filter === "pendientes") return !a.done;
		if (filter === "hechas") return a.done;
		return true;
	});
	const overdue = visible.filter((a) => dueState(a.dueDate, a.done) === "overdue");
	const today = visible.filter((a) => dueState(a.dueDate, a.done) === "today");
	const soon = visible.filter((a) => dueState(a.dueDate, a.done) === "soon");
	const later = visible.filter((a) => dueState(a.dueDate, a.done) === "later");
	const done = visible.filter((a) => a.done);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Pendientes",
			title: "Tareas",
			description: "Marca cada actividad cuando la termines. Lo vencido aparece primero.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ink",
				onClick: () => setOpen(true),
				disabled: courses.length === 0,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Nueva tarea"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-5 flex gap-1 rounded-[14px] bg-paper-3 p-1 w-fit",
			children: [
				["pendientes", "Pendientes"],
				["hechas", "Hechas"],
				["todas", "Todas"]
			].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setFilter(id),
				className: cn("rounded-[10px] px-3 py-1.5 text-sm font-medium transition-colors duration-150", filter === id ? "bg-paper-2 text-ink shadow-card" : "text-ink-soft hover:text-ink"),
				children: label
			}, id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, { children: visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "py-10 text-center text-sm text-ink-soft",
			children: courses.length === 0 ? "Crea una materia para poder cargar actividades." : filter === "hechas" ? "Todavía no marcas ninguna como hecha." : "No hay tareas en esta vista."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskGroup, {
					title: "Vencidas",
					count: overdue.length,
					children: overdue.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskRow, {
						activity: a,
						course: courseById[a.courseId],
						onToggle: toggleActivity
					}, a.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskGroup, {
					title: "Hoy",
					count: today.length,
					children: today.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskRow, {
						activity: a,
						course: courseById[a.courseId],
						onToggle: toggleActivity
					}, a.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskGroup, {
					title: "Próximos días",
					count: soon.length,
					children: soon.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskRow, {
						activity: a,
						course: courseById[a.courseId],
						onToggle: toggleActivity
					}, a.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskGroup, {
					title: "Más adelante",
					count: later.length,
					children: later.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskRow, {
						activity: a,
						course: courseById[a.courseId],
						onToggle: toggleActivity
					}, a.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskGroup, {
					title: "Hechas",
					count: done.length,
					children: done.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskRow, {
						activity: a,
						course: courseById[a.courseId],
						onToggle: toggleActivity
					}, a.id))
				})
			]
		}) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Nueva tarea" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Asóciala a una materia y a un corte." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityForm, {
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
//#endregion
export { TareasPage as component };
