import { i as __toESM } from "../_runtime.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Plus, h as ArrowLeft, o as Pencil, r as Trash2 } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { O as cn, a as Button, c as activitiesForCorte, f as formatGrade, i as Panel, l as computedCorteGrade, n as Route, o as useAcademicStore, s as useActiveSemester, u as computedFinalGrade, v as formatLongDate, y as formatTimeRange } from "./router-CLkn-OOS.mjs";
import { n as DAYS } from "./types-CmQeLfnc.mjs";
import { n as GradeMeter, t as GradeChip } from "./grade-meter-CLwWzOT9.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, o as Input, r as DialogDescription, s as Label, t as Dialog } from "./label-C-cbMt7J.mjs";
import { t as Badge } from "./badge-DTDLpdUk.mjs";
import { r as buildCourseFromForm, t as CourseForm } from "./course-form-D1oFS48g.mjs";
import { i as sortActivities, r as TaskRow, t as ActivityForm } from "./activity-form-DFpZ4oFH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/materias._id-O6bNPuyi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Separator({ className, vertical }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "separator",
		className: cn(vertical ? "w-px self-stretch bg-rule" : "h-px w-full bg-rule", className)
	});
}
function CourseDetail() {
	const { id } = Route.useParams();
	const navigate = useNavigate();
	const course = useAcademicStore((s) => s.courses.find((c) => c.id === id));
	const courseSemester = useAcademicStore((s) => s.semesters.find((x) => x.id === course?.semesterId));
	const activeSemester = useActiveSemester();
	const semester = courseSemester ?? activeSemester;
	const activities = useAcademicStore((s) => s.activities.filter((a) => a.courseId === id));
	const settings = useAcademicStore((s) => s.settings);
	const toggleActivity = useAcademicStore((s) => s.toggleActivity);
	const updateCourse = useAcademicStore((s) => s.updateCourse);
	const deleteCourse = useAcademicStore((s) => s.deleteCourse);
	const addActivity = useAcademicStore((s) => s.addActivity);
	const deleteActivity = useAcademicStore((s) => s.deleteActivity);
	const [editOpen, setEditOpen] = (0, import_react.useState)(false);
	const [actOpen, setActOpen] = (0, import_react.useState)(false);
	const [confirmDelete, setConfirmDelete] = (0, import_react.useState)(false);
	const [finalDraft, setFinalDraft] = (0, import_react.useState)("");
	const final = course ? computedFinalGrade(course, activities, semester, settings.gradeMax) : null;
	const byCorte = (0, import_react.useMemo)(() => {
		if (!semester) return [];
		return semester.cortes.map((window) => ({
			window,
			grade: course ? computedCorteGrade(course, activities, window.index, settings.gradeMax) : null,
			items: sortActivities(activitiesForCorte(activities, id, window.index))
		}));
	}, [
		semester,
		course,
		activities,
		id,
		settings.gradeMax
	]);
	if (!course) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-16 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-2xl",
			children: "No encontramos esa materia"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			className: "mt-4",
			variant: "ink",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/materias",
				children: "Volver"
			})
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/materias",
			className: "mb-4 inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Materias"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "size-11 shrink-0 rounded-[12px]",
					style: { background: course.color }
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-[1.85rem] leading-tight text-ink",
							children: course.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-ink-soft",
							children: [course.code, course.professor].filter(Boolean).join(" · ") || "Sin datos del docente"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex flex-wrap gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: course.type }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: [course.credits, " créditos"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									tone: "accent",
									children: [
										formatLongDate(course.startDate),
										" – ",
										formatLongDate(course.endDate)
									]
								})
							]
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => setEditOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" }), "Editar"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					className: "text-danger hover:bg-danger/10",
					onClick: () => setConfirmDelete(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), "Borrar"]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-3 flex items-center justify-between",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg",
						children: "Horario"
					})
				}), course.schedule.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-ink-soft",
					children: "Sin bloques de horario."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex flex-col gap-2",
					children: course.schedule.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between rounded-[12px] bg-paper px-3 py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: DAYS[s.day]?.long
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-ink-soft tabular-nums",
							children: [formatTimeRange(s.startTime, s.endTime), s.room ? ` · ${s.room}` : ""]
						})]
					}, s.id))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg",
						children: "Cortes y actividades"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "ink",
						onClick: () => setActOpen(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), "Actividad"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-6",
					children: byCorte.map(({ window, grade, items }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-semibold text-ink",
							children: window.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-ink-faint",
							children: [
								formatLongDate(window.startDate),
								" – ",
								formatLongDate(window.endDate),
								" · ",
								window.weight,
								"%"
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-[11px]",
								children: "Nota del corte"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "h-8 w-20 text-center tabular-nums",
								type: "number",
								min: 0,
								max: settings.gradeMax,
								step: settings.gradeMax === 100 ? 1 : .1,
								placeholder: grade == null ? "—" : formatGrade(grade, settings.gradeMax),
								defaultValue: course.cortes.find((c) => c.index === window.index)?.grade ?? "",
								onBlur: (e) => {
									const raw = e.target.value;
									const next = raw === "" ? null : Number(raw);
									updateCourse(course.id, { cortes: course.cortes.map((c) => c.index === window.index ? {
										...c,
										grade: next
									} : c) });
								}
							}, `${course.id}-${window.index}-${course.cortes.find((c) => c.index === window.index)?.grade ?? "x"}`)]
						})]
					}), items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-2 text-sm text-ink-faint",
						children: "Sin actividades en este corte."
					}) : items.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "group relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskRow, {
							activity: a,
							onToggle: toggleActivity
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute top-2 right-2 hidden items-center gap-1 group-hover:flex",
							children: [a.grade != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradeChip, {
								value: a.grade,
								max: settings.gradeMax,
								passing: settings.passingGrade
							}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "size-8 rounded-[8px] text-ink-faint hover:bg-paper-3 hover:text-danger",
								"aria-label": "Eliminar actividad",
								onClick: () => deleteActivity(a.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mx-auto size-3.5" })
							})]
						})]
					}, a.id))] }, window.index))
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-3 font-display text-lg",
						children: "Nota final"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradeMeter, {
						value: final,
						max: settings.gradeMax,
						passing: settings.passingGrade,
						size: 88,
						label: "Promedio ponderado de cortes"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "my-4" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "mb-1.5 block",
						children: "Sobrescribir nota final"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 0,
							max: settings.gradeMax,
							step: settings.gradeMax === 100 ? 1 : .1,
							placeholder: "Auto",
							value: finalDraft,
							onChange: (e) => setFinalDraft(e.target.value)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => {
								const next = finalDraft === "" ? null : Number(finalDraft);
								updateCourse(course.id, { finalGrade: next });
								toast.success(next == null ? "Volvió al cálculo automático" : "Nota final guardada");
							},
							children: "Guardar"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-ink-faint",
						children: "Si la dejas vacía, Aula calcula con los pesos de cada corte."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 flex flex-col gap-2",
						children: byCorte.map(({ window, grade }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-ink-soft",
								children: [window.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "ml-1 text-xs text-ink-faint",
									children: [
										"(",
										window.weight,
										"%)"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("font-mono tabular-nums", grade == null ? "text-ink-faint" : "text-ink"),
								children: formatGrade(grade, settings.gradeMax)
							})]
						}, window.index))
					})
				] }), course.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-2 font-display text-lg",
					children: "Notas"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "whitespace-pre-wrap text-sm text-ink-soft",
					children: course.notes
				})] }) : null]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: editOpen,
			onOpenChange: setEditOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-2xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Editar materia" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Horario, fechas y datos del módulo." })] }), semester ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CourseForm, {
					semester,
					initial: course,
					submitLabel: "Guardar cambios",
					onCancel: () => setEditOpen(false),
					onSubmit: (values) => {
						updateCourse(course.id, buildCourseFromForm(values, semester, course));
						toast.success("Materia actualizada");
						setEditOpen(false);
					}
				}) : null]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: actOpen,
			onOpenChange: setActOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Nueva actividad" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Fecha de entrega y corte al que pertenece." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityForm, {
				courses: [course],
				semester,
				defaultCourseId: course.id,
				submitLabel: "Agregar",
				onCancel: () => setActOpen(false),
				onSubmit: (v) => {
					addActivity(v);
					toast.success("Actividad agregada");
					setActOpen(false);
				}
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: confirmDelete,
			onOpenChange: setConfirmDelete,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: [
				"¿Borrar ",
				course.name,
				"?"
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Se eliminan también sus actividades. Esta acción no se puede deshacer." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: () => setConfirmDelete(false),
					children: "Cancelar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "danger",
					onClick: () => {
						deleteCourse(course.id);
						toast.success("Materia eliminada");
						navigate({ to: "/materias" });
					},
					children: "Borrar"
				})]
			})] })
		})
	] });
}
//#endregion
export { CourseDetail as component };
