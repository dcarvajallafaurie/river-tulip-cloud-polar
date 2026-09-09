import { i as __toESM } from "../_runtime.mjs";
import { m as require_react, p as require_jsx_runtime, u as Slot } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { _ as createRootRoute, b as useRouter, d as useRouterState, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Plus, c as GraduationCap, i as SquareCheckBig, m as BookOpen, n as TriangleAlert, p as CalendarDays, s as LayoutDashboard } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
import { a as isAfter, d as addDays, i as isBefore, l as startOfDay, n as parseISO, o as format, r as isToday, s as isSameDay, t as es, u as startOfWeek } from "../_libs/date-fns.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CLkn-OOS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid() {
	if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
	return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
var SEED_SEMESTER = {
	id: "sem-2026-2",
	name: "2026-2",
	type: "semestral",
	startDate: "2026-08-04",
	endDate: "2026-12-05",
	isActive: true,
	cortes: [
		{
			index: 0,
			name: "Corte 1",
			startDate: "2026-08-04",
			endDate: "2026-09-19",
			weight: 33
		},
		{
			index: 1,
			name: "Corte 2",
			startDate: "2026-09-22",
			endDate: "2026-10-31",
			weight: 33
		},
		{
			index: 2,
			name: "Corte 3",
			startDate: "2026-11-03",
			endDate: "2026-12-05",
			weight: 34
		}
	]
};
var emptyCortes = (grades) => grades.map((grade, index) => ({
	index,
	grade
}));
var SEED_COURSES = [
	{
		id: "curso-calculo",
		semesterId: "sem-2026-2",
		name: "Cálculo Integral",
		code: "MAT-204",
		professor: "Dra. Helena Ríos",
		color: "#2C4A5E",
		type: "semestral",
		startDate: "2026-08-04",
		endDate: "2026-12-05",
		credits: 4,
		notes: "",
		finalGrade: null,
		cortes: emptyCortes([
			3.8,
			null,
			null
		]),
		schedule: [{
			id: "sl-calc-1",
			day: 0,
			startTime: "07:00",
			endTime: "09:00",
			room: "B-204"
		}, {
			id: "sl-calc-2",
			day: 2,
			startTime: "07:00",
			endTime: "09:00",
			room: "B-204"
		}]
	},
	{
		id: "curso-fisica",
		semesterId: "sem-2026-2",
		name: "Física Mecánica",
		code: "FIS-102",
		professor: "Ing. Pablo Merino",
		color: "#3D5340",
		type: "semestral",
		startDate: "2026-08-04",
		endDate: "2026-12-05",
		credits: 4,
		notes: "",
		finalGrade: null,
		cortes: emptyCortes([
			4.2,
			null,
			null
		]),
		schedule: [{
			id: "sl-fis-1",
			day: 1,
			startTime: "09:00",
			endTime: "11:00",
			room: "Lab 3"
		}, {
			id: "sl-fis-2",
			day: 3,
			startTime: "09:00",
			endTime: "11:00",
			room: "Lab 3"
		}]
	},
	{
		id: "curso-poo",
		semesterId: "sem-2026-2",
		name: "Programación Orientada a Objetos",
		code: "SIS-210",
		professor: "MSc. Laura Cano",
		color: "#6B3E3A",
		type: "semestral",
		startDate: "2026-08-04",
		endDate: "2026-12-05",
		credits: 3,
		notes: "",
		finalGrade: null,
		cortes: emptyCortes([
			4.5,
			null,
			null
		]),
		schedule: [
			{
				id: "sl-poo-1",
				day: 0,
				startTime: "14:00",
				endTime: "16:00",
				room: "C-110"
			},
			{
				id: "sl-poo-2",
				day: 2,
				startTime: "14:00",
				endTime: "16:00",
				room: "C-110"
			},
			{
				id: "sl-poo-3",
				day: 4,
				startTime: "14:00",
				endTime: "16:00",
				room: "C-110"
			}
		]
	},
	{
		id: "curso-algebra",
		semesterId: "sem-2026-2",
		name: "Álgebra Lineal",
		code: "MAT-203",
		professor: "Dr. Andrés Pineda",
		color: "#3E5560",
		type: "semestral",
		startDate: "2026-08-04",
		endDate: "2026-12-05",
		credits: 3,
		notes: "",
		finalGrade: null,
		cortes: emptyCortes([
			3.5,
			null,
			null
		]),
		schedule: [{
			id: "sl-alg-1",
			day: 1,
			startTime: "14:00",
			endTime: "16:00",
			room: "A-12"
		}, {
			id: "sl-alg-2",
			day: 3,
			startTime: "14:00",
			endTime: "16:00",
			room: "A-12"
		}]
	},
	{
		id: "curso-com",
		semesterId: "sem-2026-2",
		name: "Comunicación Oral y Escrita",
		code: "HUM-110",
		professor: "Lic. Sofía Vargas",
		color: "#5C4A38",
		type: "semestral",
		startDate: "2026-08-04",
		endDate: "2026-12-05",
		credits: 2,
		notes: "",
		finalGrade: null,
		cortes: emptyCortes([
			4,
			null,
			null
		]),
		schedule: [{
			id: "sl-com-1",
			day: 4,
			startTime: "09:00",
			endTime: "11:00",
			room: "H-03"
		}]
	},
	{
		id: "curso-const",
		semesterId: "sem-2026-2",
		name: "Constitución Política",
		code: "DER-101",
		professor: "Abg. Camilo Restrepo",
		color: "#3A5550",
		type: "semestral",
		startDate: "2026-08-04",
		endDate: "2026-12-05",
		credits: 2,
		notes: "",
		finalGrade: null,
		cortes: emptyCortes([
			4.8,
			null,
			null
		]),
		schedule: [{
			id: "sl-const-1",
			day: 5,
			startTime: "08:00",
			endTime: "10:00",
			room: "Auditorio"
		}]
	}
];
var SEED_ACTIVITIES = [
	{
		id: "act-1",
		courseId: "curso-calculo",
		name: "Taller 4 — técnicas de integración",
		description: "Sustitución trigonométrica y fracciones parciales.",
		dueDate: "2026-09-08",
		done: false,
		corteIndex: 0,
		grade: null,
		createdAt: "2026-08-20"
	},
	{
		id: "act-2",
		courseId: "curso-fisica",
		name: "Quiz de cinemática",
		description: "Movimiento parabólico y relativa.",
		dueDate: "2026-09-09",
		done: false,
		corteIndex: 0,
		grade: null,
		createdAt: "2026-08-25"
	},
	{
		id: "act-3",
		courseId: "curso-fisica",
		name: "Informe laboratorio 2",
		description: "Caída libre y registro de datos.",
		dueDate: "2026-09-10",
		done: false,
		corteIndex: 0,
		grade: null,
		createdAt: "2026-08-28"
	},
	{
		id: "act-4",
		courseId: "curso-poo",
		name: "Entrega sprint 2",
		description: "Herencia, interfaces y pruebas unitarias.",
		dueDate: "2026-09-11",
		done: false,
		corteIndex: 0,
		grade: null,
		createdAt: "2026-08-18"
	},
	{
		id: "act-5",
		courseId: "curso-algebra",
		name: "Taller de espacios vectoriales",
		description: "Base, dimensión e independencia lineal.",
		dueDate: "2026-09-12",
		done: false,
		corteIndex: 0,
		grade: null,
		createdAt: "2026-08-22"
	},
	{
		id: "act-6",
		courseId: "curso-com",
		name: "Ensayo argumentativo",
		description: "1.500 palabras, citas APA.",
		dueDate: "2026-09-15",
		done: false,
		corteIndex: 0,
		grade: null,
		createdAt: "2026-08-30"
	},
	{
		id: "act-7",
		courseId: "curso-calculo",
		name: "Parcial corte 1",
		description: "Integrales definidas y teorema fundamental.",
		dueDate: "2026-09-17",
		done: false,
		corteIndex: 0,
		grade: null,
		createdAt: "2026-08-10"
	},
	{
		id: "act-8",
		courseId: "curso-const",
		name: "Lectura capítulo 4",
		description: "Rama judicial y control de constitucionalidad.",
		dueDate: "2026-09-06",
		done: true,
		corteIndex: 0,
		grade: 5,
		createdAt: "2026-08-15"
	},
	{
		id: "act-9",
		courseId: "curso-poo",
		name: "Lectura de patrones",
		description: "Factory, Strategy y Observer.",
		dueDate: "2026-09-04",
		done: true,
		corteIndex: 0,
		grade: 4.5,
		createdAt: "2026-08-12"
	},
	{
		id: "act-10",
		courseId: "curso-algebra",
		name: "Quices semanales",
		description: "Promedio de los cinco primeros quices.",
		dueDate: "2026-09-05",
		done: true,
		corteIndex: 0,
		grade: 3.8,
		createdAt: "2026-08-08"
	},
	{
		id: "act-11",
		courseId: "curso-poo",
		name: "Proyecto final — propuesta",
		description: "Documento de alcance y diagrama de clases.",
		dueDate: "2026-10-08",
		done: false,
		corteIndex: 1,
		grade: null,
		createdAt: "2026-09-01"
	},
	{
		id: "act-12",
		courseId: "curso-fisica",
		name: "Parcial corte 2",
		description: "Leyes de Newton y trabajo-energía.",
		dueDate: "2026-10-20",
		done: false,
		corteIndex: 1,
		grade: null,
		createdAt: "2026-09-01"
	}
];
function parseDate(iso) {
	return parseISO(iso.length <= 10 ? `${iso}T12:00:00` : iso);
}
function toISODate(date) {
	return format(date, "yyyy-MM-dd");
}
function formatLongDate(iso) {
	return format(parseDate(iso), "d 'de' MMMM", { locale: es });
}
function formatWeekdayDate(iso) {
	return format(parseDate(iso), "EEE d MMM", { locale: es });
}
function formatTodayHeading(date = /* @__PURE__ */ new Date()) {
	const raw = format(date, "EEEE d 'de' MMMM", { locale: es });
	return raw.charAt(0).toUpperCase() + raw.slice(1);
}
function mondayOf(date) {
	return startOfWeek(date, { weekStartsOn: 1 });
}
function weekDays(anchor) {
	const start = mondayOf(anchor);
	return Array.from({ length: 6 }, (_, i) => addDays(start, i));
}
function timeToMinutes(hhmm) {
	const [h, m] = hhmm.split(":").map(Number);
	return (h ?? 0) * 60 + (m ?? 0);
}
function minutesToTime(mins) {
	const h = Math.floor(mins / 60);
	const m = mins % 60;
	return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
function formatTimeRange(start, end) {
	const strip = (t) => t.endsWith(":00") ? t.slice(0, 5).replace(/^0/, "") : t;
	return `${strip(start)}–${strip(end)}`;
}
function jsDayToSlot(jsDay) {
	if (jsDay === 0) return null;
	return jsDay - 1;
}
function dueState(iso, done) {
	if (done) return "done";
	const d = startOfDay(parseDate(iso));
	const today = startOfDay(/* @__PURE__ */ new Date());
	if (isToday(d)) return "today";
	if (isBefore(d, today)) return "overdue";
	const inThree = addDays(today, 3);
	if (!isAfter(d, inThree) || isSameDay(d, inThree)) return "soon";
	return "later";
}
function inRange(iso, start, end) {
	const d = parseDate(iso);
	return !isBefore(d, parseDate(start)) && !isAfter(d, parseDate(end));
}
function roundGrade(value, max) {
	if (max === 100) return Math.round(value);
	return Math.round(value * 10) / 10;
}
function formatGrade(value, max) {
	if (value == null || Number.isNaN(value)) return "—";
	if (max === 100) return String(Math.round(value));
	return value.toFixed(1);
}
function gradeTone(value, passing, max) {
	if (value == null) return "empty";
	const good = max === 5 ? 4 : max === 10 ? 8 : 80;
	if (value < passing) return "fail";
	if (value >= good) return "good";
	return "pass";
}
function activitiesForCorte(activities, courseId, corteIndex) {
	return activities.filter((a) => a.courseId === courseId && a.corteIndex === corteIndex);
}
function computedCorteGrade(course, activities, corteIndex, max) {
	const stored = course.cortes.find((c) => c.index === corteIndex)?.grade;
	if (stored != null) return stored;
	const graded = activitiesForCorte(activities, course.id, corteIndex).filter((a) => a.grade != null);
	if (graded.length === 0) return null;
	return roundGrade(graded.reduce((s, a) => s + (a.grade ?? 0), 0) / graded.length, max);
}
function computedFinalGrade(course, activities, semester, max) {
	if (course.finalGrade != null) return course.finalGrade;
	if (!semester) return null;
	let weighted = 0;
	let weightSum = 0;
	for (const window of semester.cortes) {
		const g = computedCorteGrade(course, activities, window.index, max);
		if (g == null) continue;
		weighted += g * window.weight;
		weightSum += window.weight;
	}
	if (weightSum === 0) return null;
	return roundGrade(weighted / weightSum, max);
}
function semesterAverage(courses, activities, semester, max) {
	if (!semester) return null;
	const mine = courses.filter((c) => c.semesterId === semester.id);
	let points = 0;
	let credits = 0;
	for (const course of mine) {
		const g = computedFinalGrade(course, activities, semester, max);
		if (g == null) continue;
		const cr = course.credits || 1;
		points += g * cr;
		credits += cr;
	}
	if (credits === 0) return null;
	return roundGrade(points / credits, max);
}
function inferCorteIndex(dueDate, semester) {
	if (!semester || semester.cortes.length === 0) return 0;
	for (const corte of semester.cortes) if (inRange(dueDate, corte.startDate, corte.endDate)) return corte.index;
	if (dueDate < semester.cortes[0].startDate) return 0;
	return semester.cortes[semester.cortes.length - 1].index;
}
function currentCorte(semester, todayISO) {
	if (!semester) return null;
	return semester.cortes.find((c) => inRange(todayISO, c.startDate, c.endDate)) ?? null;
}
function progressThrough(start, end, todayISO) {
	const s = Date.parse(start);
	const e = Date.parse(end);
	const t = Date.parse(todayISO);
	if (!Number.isFinite(s) || !Number.isFinite(e) || e <= s) return 0;
	return Math.min(1, Math.max(0, (t - s) / (e - s)));
}
var defaultSettings = {
	gradeMax: 5,
	passingGrade: 3,
	studentName: "",
	university: ""
};
var emptyState = {
	userCleared: false,
	settings: defaultSettings,
	semesters: [],
	courses: [],
	activities: []
};
function seedPayload() {
	return {
		userCleared: false,
		settings: defaultSettings,
		semesters: [structuredClone(SEED_SEMESTER)],
		courses: structuredClone(SEED_COURSES),
		activities: structuredClone(SEED_ACTIVITIES)
	};
}
var useAcademicStore = create()(persist((set, get) => ({
	hydrated: false,
	newCourseOpen: false,
	...emptyState,
	setHydrated: (v) => set({ hydrated: v }),
	setNewCourseOpen: (v) => set({ newCourseOpen: v }),
	ensureSeed: () => {
		const s = get();
		if (s.userCleared) return;
		if (s.semesters.length === 0 && s.courses.length === 0) set(seedPayload());
	},
	resetToSeed: () => set(seedPayload()),
	clearAll: () => set({
		...emptyState,
		userCleared: true
	}),
	updateSettings: (patch) => set((s) => ({ settings: {
		...s.settings,
		...patch
	} })),
	addSemester: (raw) => {
		const id = raw.id ?? uid();
		const semester = {
			...raw,
			id,
			isActive: raw.isActive ?? get().semesters.length === 0
		};
		set((s) => ({ semesters: semester.isActive ? [...s.semesters.map((x) => ({
			...x,
			isActive: false
		})), semester] : [...s.semesters, semester] }));
		return id;
	},
	updateSemester: (id, patch) => set((s) => ({ semesters: s.semesters.map((x) => x.id === id ? {
		...x,
		...patch
	} : x) })),
	deleteSemester: (id) => set((s) => ({
		semesters: s.semesters.filter((x) => x.id !== id),
		courses: s.courses.filter((c) => c.semesterId !== id),
		activities: s.activities.filter((a) => {
			return s.courses.find((c) => c.id === a.courseId)?.semesterId !== id;
		})
	})),
	setActiveSemester: (id) => set((s) => ({ semesters: s.semesters.map((x) => ({
		...x,
		isActive: x.id === id
	})) })),
	addCourse: (raw) => {
		const id = raw.id ?? uid();
		const course = {
			...raw,
			id
		};
		set((s) => ({ courses: [...s.courses, course] }));
		return id;
	},
	updateCourse: (id, patch) => set((s) => ({ courses: s.courses.map((c) => c.id === id ? {
		...c,
		...patch
	} : c) })),
	deleteCourse: (id) => set((s) => ({
		courses: s.courses.filter((c) => c.id !== id),
		activities: s.activities.filter((a) => a.courseId !== id)
	})),
	addActivity: (raw) => {
		const id = raw.id ?? uid();
		const semester = get().semesters.find((x) => x.isActive);
		const corteIndex = raw.corteIndex ?? inferCorteIndex(raw.dueDate, semester);
		const activity = {
			...raw,
			id,
			corteIndex,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		set((s) => ({ activities: [...s.activities, activity] }));
		return id;
	},
	updateActivity: (id, patch) => set((s) => ({ activities: s.activities.map((a) => a.id === id ? {
		...a,
		...patch
	} : a) })),
	toggleActivity: (id) => set((s) => ({ activities: s.activities.map((a) => a.id === id ? {
		...a,
		done: !a.done
	} : a) })),
	deleteActivity: (id) => set((s) => ({ activities: s.activities.filter((a) => a.id !== id) }))
}), {
	name: "aula-academic-v1",
	version: 1,
	skipHydration: true,
	storage: createJSONStorage(() => {
		if (typeof window === "undefined") return {
			getItem: () => null,
			setItem: () => {},
			removeItem: () => {}
		};
		return localStorage;
	}),
	partialize: (s) => ({
		userCleared: s.userCleared,
		settings: s.settings,
		semesters: s.semesters,
		courses: s.courses,
		activities: s.activities
	})
}));
function useActiveSemester() {
	return useAcademicStore((s) => s.semesters.find((x) => x.isActive) ?? s.semesters[0]);
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium select-none transition-[background-color,color,box-shadow,transform,opacity] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:bg-accent/90",
			ink: "bg-ink text-paper hover:bg-ink-2",
			secondary: "bg-paper-3 text-ink hover:bg-rule",
			outline: "bg-transparent text-ink shadow-[var(--shadow-border)] hover:bg-paper-2",
			ghost: "bg-transparent text-ink hover:bg-paper-3",
			danger: "bg-danger text-paper hover:bg-danger/90",
			paper: "bg-paper-2 text-ink shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]"
		},
		size: {
			sm: "h-8 px-3 text-sm rounded-[8px] [&_svg]:size-3.5",
			md: "h-10 px-4 text-sm rounded-[10px] [&_svg]:size-4",
			lg: "h-12 px-5 text-base rounded-[12px] [&_svg]:size-4",
			icon: "size-10 rounded-[10px] [&_svg]:size-4",
			"icon-sm": "size-8 rounded-[8px] [&_svg]:size-3.5"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "md"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, staticScale, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		ref,
		className: cn(buttonVariants({
			variant,
			size
		}), !staticScale && "active:not-disabled:scale-[0.96]", className),
		...props
	});
});
Button.displayName = "Button";
function Toaster$1() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		theme: "light",
		position: "bottom-right",
		toastOptions: { classNames: {
			toast: "bg-paper-2 text-ink shadow-[var(--shadow-border-hover)] border-0 rounded-[16px] font-[Figtree,sans-serif]",
			title: "text-ink font-medium",
			description: "text-ink-soft"
		} }
	});
}
var NAV = [
	{
		to: "/",
		label: "Inicio",
		icon: LayoutDashboard
	},
	{
		to: "/horario",
		label: "Horario",
		icon: CalendarDays
	},
	{
		to: "/tareas",
		label: "Tareas",
		icon: SquareCheckBig
	},
	{
		to: "/materias",
		label: "Materias",
		icon: BookOpen
	},
	{
		to: "/periodo",
		label: "Periodo",
		icon: GraduationCap
	}
];
function AppShell({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const navigate = useNavigate();
	const hydrated = useAcademicStore((s) => s.hydrated);
	const openNewCourse = () => {
		useAcademicStore.getState().setNewCourseOpen(true);
		navigate({ to: "/materias" });
	};
	(0, import_react.useEffect)(() => {
		const unsub = useAcademicStore.persist.onFinishHydration(() => {
			useAcademicStore.getState().ensureSeed();
			useAcademicStore.getState().setHydrated(true);
		});
		useAcademicStore.persist.rehydrate();
		if (useAcademicStore.persist.hasHydrated()) {
			useAcademicStore.getState().ensureSeed();
			useAcademicStore.getState().setHydrated(true);
		}
		return unsub;
	}, []);
	if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShellSkeleton, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "paper-grain min-h-dvh",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "fixed inset-y-0 left-0 z-30 hidden w-[232px] flex-col bg-ink text-paper lg:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex flex-1 flex-col gap-0.5 px-3",
						children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, {
							...item,
							pathname
						}, item.to))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-3 pb-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "paper",
							className: "w-full justify-center",
							onClick: openNewCourse,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Nueva materia"]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-20 flex items-center justify-between border-b border-rule/80 bg-paper/85 px-4 py-3 backdrop-blur-md lg:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, { compact: true }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "icon-sm",
					variant: "ink",
					onClick: openNewCourse,
					"aria-label": "Nueva materia",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "lg:pl-[232px]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-6xl px-4 py-6 pb-28 lg:px-8 lg:py-8 lg:pb-10",
					children
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-30 border-t border-rule bg-paper/95 px-2 pt-1 pb-[max(0.4rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-5",
					children: NAV.map((item) => {
						const active = isActive(pathname, item.to);
						const Icon = item.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: cn("flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-[12px] text-[11px] font-medium", active ? "text-ink" : "text-ink-faint"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: cn("size-5", active && "stroke-[2.2]") }), item.label]
						}, item.to);
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})
		]
	});
}
function Brand({ compact }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/",
		className: cn("flex items-center gap-2.5", compact ? "" : "px-5 py-6"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "flex size-8 items-center justify-center rounded-[8px] bg-paper-2 text-ink shadow-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: "0 0 24 24",
				className: "size-4",
				fill: "none",
				"aria-hidden": true,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "5",
						y: "4",
						width: "14",
						height: "16",
						rx: "1.4",
						stroke: "currentColor",
						strokeWidth: "1.6"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M5 4h3v16H5",
						fill: "#2C4A5E",
						stroke: "currentColor",
						strokeWidth: "1.2"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M11 9h5M11 12h5M11 15h3.5",
						stroke: "currentColor",
						strokeWidth: "1.4",
						strokeLinecap: "round"
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-display block text-lg leading-none text-paper lg:text-paper",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: compact ? "text-ink" : "text-paper",
				children: "Aula"
			})
		}), !compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[11px] tracking-wide text-paper/55",
			children: "Tu semestre, en orden"
		}) : null] })]
	});
}
function NavLink({ to, label, icon: Icon, pathname }) {
	const active = isActive(pathname, to);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: cn("flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-sm transition-colors duration-150", active ? "bg-paper/12 text-paper" : "text-paper/60 hover:bg-paper/8 hover:text-paper"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), label]
	});
}
function isActive(pathname, to) {
	if (to === "/") return pathname === "/";
	return pathname === to || pathname.startsWith(`${to}/`);
}
function ShellSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "paper-grain min-h-dvh",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "hidden lg:block",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fixed inset-y-0 left-0 w-[232px] bg-ink" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "lg:pl-[232px]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-6xl px-4 py-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-48 rounded-md bg-paper-3" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-3 h-4 w-72 rounded bg-paper-3/80" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 grid gap-4 lg:grid-cols-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-64 rounded-[24px] bg-paper-2 shadow-card lg:col-span-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-64 rounded-[24px] bg-paper-2 shadow-card" })]
					})
				]
			})
		})]
	});
}
function PageHeader({ kicker, title, description, actions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [
				kicker ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint",
					children: kicker
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-[1.85rem] text-ink sm:text-[2.15rem]",
					children: title
				}),
				description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-xl text-sm text-ink-soft",
					children: description
				}) : null
			]
		}), actions ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex shrink-0 flex-wrap items-center gap-2",
			children: actions
		}) : null]
	});
}
function Panel({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: cn("rounded-[24px] bg-paper-2 p-4 shadow-card sm:p-5", className),
		children
	});
}
var styles_default = "/assets/styles-C0kG6Lc9.css";
var APP_NAME = "Aula";
var Route$6 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#1B1914"
			},
			{
				name: "description",
				content: "Organiza horarios, cortes, actividades y notas de la universidad."
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=IBM+Plex+Mono:wght@400;500&display=swap"
			}
		]
	}),
	component: Root
});
function Root() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "es",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	});
}
var $$splitComponentImporter$5 = () => import("./routes-CF5vDy7y.mjs");
var Route$5 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./horario-Cnf1r0uo.mjs");
var Route$4 = createFileRoute("/horario")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./materias-DaOK8s3K.mjs");
var Route$3 = createFileRoute("/materias")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./periodo-B6e7UicW.mjs");
var Route$2 = createFileRoute("/periodo")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./tareas-BbaH78MZ.mjs");
var Route$1 = createFileRoute("/tareas")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./materias._id-O6bNPuyi.mjs");
var Route = createFileRoute("/materias/$id")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var IndexRoute = Route$5.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$6
});
var HorarioRoute = Route$4.update({
	id: "/horario",
	path: "/horario",
	getParentRoute: () => Route$6
});
var MateriasRoute = Route$3.update({
	id: "/materias",
	path: "/materias",
	getParentRoute: () => Route$6
});
var PeriodoRoute = Route$2.update({
	id: "/periodo",
	path: "/periodo",
	getParentRoute: () => Route$6
});
var TareasRoute = Route$1.update({
	id: "/tareas",
	path: "/tareas",
	getParentRoute: () => Route$6
});
var MateriasRouteChildren = { MateriasIdRoute: Route.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => MateriasRoute
}) };
var rootRouteChildren = {
	IndexRoute,
	HorarioRoute,
	MateriasRoute: MateriasRoute._addFileChildren(MateriasRouteChildren),
	PeriodoRoute,
	TareasRoute
};
var routeTree = Route$6._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { minutesToTime as C, weekDays as D, toISODate as E, cn as O, jsDayToSlot as S, timeToMinutes as T, dueState as _, Button as a, formatTodayHeading as b, activitiesForCorte as c, currentCorte as d, formatGrade as f, semesterAverage as g, progressThrough as h, Panel as i, uid as k, computedCorteGrade as l, inferCorteIndex as m, Route as n, useAcademicStore as o, gradeTone as p, PageHeader as r, useActiveSemester as s, router_exports as t, computedFinalGrade as u, formatLongDate as v, mondayOf as w, formatWeekdayDate as x, formatTimeRange as y };
