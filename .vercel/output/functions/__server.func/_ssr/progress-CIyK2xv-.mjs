import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { O as cn } from "./router-CLkn-OOS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/progress-CIyK2xv-.js
var import_jsx_runtime = require_jsx_runtime();
function Progress({ value, className, barClassName }) {
	const pct = Math.min(100, Math.max(0, value));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("h-1.5 w-full overflow-hidden rounded-full bg-paper-3", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("h-full rounded-full bg-accent transition-[width] duration-300", barClassName),
			style: { width: `${pct}%` }
		})
	});
}
//#endregion
export { Progress as t };
