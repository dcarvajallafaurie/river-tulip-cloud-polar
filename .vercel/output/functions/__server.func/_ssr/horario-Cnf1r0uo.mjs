import { i as __toESM } from "../_runtime.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { d as ChevronLeft, u as ChevronRight } from "../_libs/lucide-react.mjs";
import { c as addWeeks, o as format, t as es } from "../_libs/date-fns.mjs";
import { D as weekDays, a as Button, i as Panel, o as useAcademicStore, r as PageHeader, s as useActiveSemester, w as mondayOf, y as formatTimeRange } from "./router-CLkn-OOS.mjs";
import { n as DAYS } from "./types-CmQeLfnc.mjs";
import { n as WeekGrid, t as TodayTimeline } from "./week-grid-Gykq90y1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/horario-Cnf1r0uo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HorarioPage() {
	const [anchor, setAnchor] = (0, import_react.useState)(() => /* @__PURE__ */ new Date());
	const semester = useActiveSemester();
	const courses = useAcademicStore((s) => semester ? s.courses.filter((c) => c.semesterId === semester.id) : s.courses);
	const days = weekDays(anchor);
	const start = mondayOf(anchor);
	const end = days[5];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Calendario",
			title: "Horario",
			description: "La grilla de la semana con cada módulo, salón y bloque.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: () => setAnchor((d) => addWeeks(d, -1)),
						"aria-label": "Semana anterior",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => setAnchor(/* @__PURE__ */ new Date()),
						children: "Hoy"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: () => setAnchor((d) => addWeeks(d, 1)),
						"aria-label": "Semana siguiente",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {})
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mb-4 text-sm text-ink-soft",
			children: [
				format(start, "d MMM", { locale: es }),
				" – ",
				end ? format(end, "d MMM yyyy", { locale: es }) : ""
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
			className: "mb-4",
			children: courses.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-10 text-center text-sm text-ink-soft",
				children: "Aún no hay clases en este periodo."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeekGrid, {
				courses,
				anchor
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 font-display text-lg",
				children: "Hoy, en lista"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TodayTimeline, { courses })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 font-display text-lg",
				children: "Bloques por materia"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-col gap-3",
				children: courses.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 size-3 shrink-0 rounded-full",
						style: { background: c.color }
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium text-ink",
							children: c.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-ink-soft",
							children: c.schedule.length === 0 ? "Sin horario" : c.schedule.map((s) => `${DAYS[s.day]?.short} ${formatTimeRange(s.startTime, s.endTime)}${s.room ? ` (${s.room})` : ""}`).join(" · ")
						})]
					})]
				}, c.id))
			})] })]
		})
	] });
}
//#endregion
export { HorarioPage as component };
