import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as format, r as isToday, s as isSameDay, t as es } from "../_libs/date-fns.mjs";
import { C as minutesToTime, D as weekDays, O as cn, S as jsDayToSlot, T as timeToMinutes, y as formatTimeRange } from "./router-CLkn-OOS.mjs";
import { n as DAYS } from "./types-CmQeLfnc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/week-grid-Gykq90y1.js
var import_jsx_runtime = require_jsx_runtime();
function visibleRange(courses) {
	let min = 420;
	let max = 1080;
	for (const c of courses) for (const s of c.schedule) {
		min = Math.min(min, timeToMinutes(s.startTime));
		max = Math.max(max, timeToMinutes(s.endTime));
	}
	min = Math.max(420, Math.floor(min / 60) * 60);
	max = Math.min(1260, Math.ceil(max / 60) * 60);
	if (max - min < 480) max = Math.min(1260, min + 660);
	return [min, max];
}
function WeekGrid({ courses, anchor, compact }) {
	const days = weekDays(anchor);
	const [startMin, endMin] = visibleRange(courses);
	const total = Math.max(endMin - startMin, 60);
	const hours = [];
	for (let m = startMin; m < endMin; m += 60) hours.push(m);
	const hourPx = compact ? 42 : 52;
	const bodyH = hours.length * hourPx;
	const placed = [];
	for (const course of courses) for (const slot of course.schedule) {
		const s = timeToMinutes(slot.startTime);
		const e = timeToMinutes(slot.endTime);
		placed.push({
			course,
			slot,
			day: slot.day,
			top: (s - startMin) / total * bodyH,
			height: Math.max((e - s) / total * bodyH, 28)
		});
	}
	const now = /* @__PURE__ */ new Date();
	const nowSlot = jsDayToSlot(now.getDay());
	const nowMin = now.getHours() * 60 + now.getMinutes();
	const showNow = nowSlot != null && nowMin >= startMin && nowMin <= endMin && days.some((d) => isToday(d));
	const nowTop = (nowMin - startMin) / total * bodyH;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("min-w-[640px]", compact && "min-w-[560px]"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid",
				style: { gridTemplateColumns: "52px repeat(6, minmax(0, 1fr))" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}), days.map((d, i) => {
					const today = isToday(d);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("px-1 pb-2 text-center", today && "text-accent"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] font-medium uppercase tracking-wider text-ink-faint",
							children: DAYS[i].short
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: cn("mx-auto mt-0.5 flex size-7 items-center justify-center rounded-full text-sm tabular-nums", today && "bg-accent text-accent-fg", !today && "text-ink"),
							children: format(d, "d", { locale: es })
						})]
					}, i);
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				style: { height: bodyH },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 grid",
						style: { gridTemplateColumns: "52px repeat(6, minmax(0, 1fr))" },
						children: hours.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "contents",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative -top-2 pr-2 text-right font-mono text-[10px] text-ink-faint tabular-nums",
								children: minutesToTime(m)
							}), DAYS.map((day) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-t border-rule/80" }, `${m}-${day.id}`))]
						}, `t-${m}`))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute top-0 right-0 bottom-0 left-[52px] grid",
						style: { gridTemplateColumns: "repeat(6, minmax(0, 1fr))" },
						children: DAYS.map((day) => {
							const date = days[day.id];
							const isColToday = date ? isToday(date) : false;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cn("relative", isColToday && "bg-accent/[0.04]"),
								children: placed.filter((p) => p.day === day.id).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/materias/$id",
									params: { id: p.course.id },
									className: "absolute right-1 left-1 overflow-hidden rounded-[8px] px-1.5 py-1 text-left transition-transform duration-150 hover:brightness-[0.97] active:scale-[0.98]",
									style: {
										top: p.top + 2,
										height: p.height - 4,
										background: tint(p.course.color, .16),
										boxShadow: `inset 3px 0 0 ${p.course.color}`
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-[11px] font-semibold leading-tight",
										style: { color: p.course.color },
										children: p.course.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "truncate font-mono text-[10px] text-ink-soft tabular-nums",
										children: [formatTimeRange(p.slot.startTime, p.slot.endTime), p.slot.room ? ` · ${p.slot.room}` : ""]
									})]
								}, p.slot.id))
							}, day.id);
						})
					}),
					showNow && nowSlot != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pointer-events-none absolute right-0 left-[52px] z-10",
						style: { top: nowTop },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative h-px bg-danger",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -top-1 -left-1 size-2 rounded-full bg-danger" })
						})
					}) : null
				]
			})]
		})
	});
}
function TodayTimeline({ courses, date = /* @__PURE__ */ new Date() }) {
	const slotDay = jsDayToSlot(date.getDay());
	const items = [];
	if (slotDay != null) {
		for (const course of courses) for (const slot of course.schedule) if (slot.day === slotDay) items.push({
			course,
			slot
		});
	}
	items.sort((a, b) => timeToMinutes(a.slot.startTime) - timeToMinutes(b.slot.startTime));
	if (items.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-ink-soft",
		children: slotDay == null ? "Hoy no hay clases (domingo)." : "No tienes clases este día."
	});
	const nowMin = date.getHours() * 60 + date.getMinutes();
	const isThisDay = isSameDay(date, /* @__PURE__ */ new Date());
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "flex flex-col gap-2",
		children: items.map(({ course, slot }) => {
			const start = timeToMinutes(slot.startTime);
			const end = timeToMinutes(slot.endTime);
			const live = isThisDay && nowMin >= start && nowMin < end;
			const past = isThisDay && nowMin >= end;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/materias/$id",
				params: { id: course.id },
				className: cn("flex items-stretch gap-3 rounded-[16px] bg-paper-2 p-2 pr-3 shadow-card transition-[box-shadow,transform] duration-150 hover:shadow-card-hover active:scale-[0.99]", past && "opacity-60"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-1.5 shrink-0 rounded-full",
					style: { background: course.color }
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1 py-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate font-medium text-ink",
							children: course.name
						}), live ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-danger/12 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-danger",
							children: "En curso"
						}) : null]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-xs text-ink-soft tabular-nums",
						children: [formatTimeRange(slot.startTime, slot.endTime), slot.room ? ` · ${slot.room}` : ""]
					})]
				})]
			}) }, slot.id);
		})
	});
}
function tint(hex, alpha) {
	const n = hex.replace("#", "");
	return `rgba(${parseInt(n.slice(0, 2), 16)}, ${parseInt(n.slice(2, 4), 16)}, ${parseInt(n.slice(4, 6), 16)}, ${alpha})`;
}
//#endregion
export { WeekGrid as n, TodayTimeline as t };
