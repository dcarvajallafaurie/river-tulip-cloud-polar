import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { O as cn } from "./router-CLkn-OOS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-DTDLpdUk.js
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase", {
	variants: { tone: {
		muted: "bg-paper-3 text-ink-soft",
		ink: "bg-ink text-paper",
		accent: "bg-accent/12 text-accent",
		success: "bg-success/12 text-success",
		danger: "bg-danger/12 text-danger",
		warn: "bg-warn/12 text-warn"
	} },
	defaultVariants: { tone: "muted" }
});
function Badge({ className, tone, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ tone }), className),
		...props
	});
}
//#endregion
export { Badge as t };
