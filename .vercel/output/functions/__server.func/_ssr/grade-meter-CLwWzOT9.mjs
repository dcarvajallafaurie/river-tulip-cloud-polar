import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { O as cn, f as formatGrade, p as gradeTone } from "./router-CLkn-OOS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/grade-meter-CLwWzOT9.js
var import_jsx_runtime = require_jsx_runtime();
function GradeMeter({ value, max, passing, size = 72, label }) {
	const tone = gradeTone(value, passing, max);
	const pct = value == null ? 0 : Math.min(1, Math.max(0, value / max));
	const r = 18;
	const c = 2 * Math.PI * r;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			width: size,
			height: size,
			viewBox: "0 0 48 48",
			className: "shrink-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "24",
					cy: "24",
					r,
					fill: "none",
					stroke: "var(--color-paper-3)",
					strokeWidth: "4"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "24",
					cy: "24",
					r,
					fill: "none",
					stroke: tone === "good" ? "var(--color-success)" : tone === "fail" ? "var(--color-danger)" : tone === "pass" ? "var(--color-accent)" : "var(--color-rule)",
					strokeWidth: "4",
					strokeLinecap: "round",
					strokeDasharray: c,
					strokeDashoffset: c * (1 - pct),
					transform: "rotate(-90 24 24)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "24",
					y: "24",
					textAnchor: "middle",
					dominantBaseline: "central",
					className: "fill-ink",
					style: {
						fontSize: 9,
						fontWeight: 600,
						fontVariantNumeric: "tabular-nums"
					},
					children: formatGrade(value, max)
				})
			]
		}), label ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs uppercase tracking-wide text-ink-faint",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: cn("text-sm font-medium", tone === "fail" && "text-danger", tone === "good" && "text-success"),
			children: tone === "empty" ? "Sin nota" : tone === "fail" ? "En riesgo" : tone === "good" ? "Sobresaliente" : "Aprobando"
		})] }) : null]
	});
}
function GradeChip({ value, max, passing }) {
	const tone = gradeTone(value, passing, max);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex min-w-10 items-center justify-center rounded-full px-2 py-0.5 text-sm font-medium tabular-nums", tone === "empty" && "bg-paper-3 text-ink-faint", tone === "fail" && "bg-danger/12 text-danger", tone === "pass" && "bg-accent/12 text-accent", tone === "good" && "bg-success/12 text-success"),
		children: formatGrade(value, max)
	});
}
//#endregion
export { GradeMeter as n, GradeChip as t };
