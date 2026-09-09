import { i as __toESM } from "../_runtime.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Plus, r as Trash2 } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { E as toISODate, a as Button, f as formatGrade, g as semesterAverage, h as progressThrough, i as Panel, o as useAcademicStore, r as PageHeader, s as useActiveSemester, u as computedFinalGrade, v as formatLongDate } from "./router-CLkn-OOS.mjs";
import { n as GradeMeter, t as GradeChip } from "./grade-meter-CLwWzOT9.mjs";
import { a as DialogTitle, c as NativeSelect, i as DialogHeader, n as DialogContent, o as Input, r as DialogDescription, s as Label, t as Dialog } from "./label-C-cbMt7J.mjs";
import { t as Badge } from "./badge-DTDLpdUk.mjs";
import { t as Progress } from "./progress-CIyK2xv-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/periodo-B6e7UicW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PeriodoPage() {
	const semesters = useAcademicStore((s) => s.semesters);
	const courses = useAcademicStore((s) => s.courses);
	const activities = useAcademicStore((s) => s.activities);
	const settings = useAcademicStore((s) => s.settings);
	const updateSettings = useAcademicStore((s) => s.updateSettings);
	const updateSemester = useAcademicStore((s) => s.updateSemester);
	const addSemester = useAcademicStore((s) => s.addSemester);
	const deleteSemester = useAcademicStore((s) => s.deleteSemester);
	const setActiveSemester = useAcademicStore((s) => s.setActiveSemester);
	const resetToSeed = useAcademicStore((s) => s.resetToSeed);
	const clearAll = useAcademicStore((s) => s.clearAll);
	const semester = useActiveSemester();
	const [open, setOpen] = (0, import_react.useState)(false);
	const mine = courses.filter((c) => semester ? c.semesterId === semester.id : true);
	const avg = semesterAverage(mine, activities, semester, settings.gradeMax);
	const today = toISODate(/* @__PURE__ */ new Date());
	const progress = semester ? progressThrough(semester.startDate, semester.endDate, today) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Académico",
			title: "Periodo y cortes",
			description: "Define si el periodo es semestral o trimestral, los cortes y la escala de notas.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ink",
				onClick: () => setOpen(true),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Nuevo periodo"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 flex flex-wrap gap-2",
			children: semesters.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setActiveSemester(s.id),
				className: s.isActive ? "rounded-full bg-ink px-3 py-1.5 text-sm text-paper" : "rounded-full bg-paper-3 px-3 py-1.5 text-sm text-ink-soft hover:text-ink",
				children: s.name
			}, s.id))
		}),
		semester ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl",
								children: semester.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-ink-soft",
								children: [
									formatLongDate(semester.startDate),
									" – ",
									formatLongDate(semester.endDate)
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: semester.type })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-1 flex justify-between text-xs text-ink-faint",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Avance del periodo" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "tabular-nums",
									children: [Math.round(progress * 100), "%"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: progress * 100 })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 grid gap-3 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Nombre",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										defaultValue: semester.name,
										onBlur: (e) => updateSemester(semester.id, { name: e.target.value })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Tipo",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
										value: semester.type,
										onChange: (e) => updateSemester(semester.id, { type: e.target.value }),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "semestral",
											children: "Semestral"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "trimestral",
											children: "Trimestral"
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: " ",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "ghost",
										className: "w-full text-danger hover:bg-danger/10",
										onClick: () => {
											if (semesters.length < 2) {
												toast.error("Deja al menos un periodo.");
												return;
											}
											deleteSemester(semester.id);
											toast.success("Periodo eliminado");
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), "Eliminar periodo"]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Inicio",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										defaultValue: semester.startDate,
										onBlur: (e) => updateSemester(semester.id, { startDate: e.target.value })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Fin",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										defaultValue: semester.endDate,
										onBlur: (e) => updateSemester(semester.id, { endDate: e.target.value })
									})
								})
							]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mb-1 font-display text-lg",
							children: "Cortes"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-4 text-sm text-ink-soft",
							children: "Pesos que sumen 100. La nota final de cada materia se pondera con estos cortes."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-col gap-3",
							children: semester.cortes.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2 rounded-[16px] bg-paper p-3 sm:grid-cols-[1fr_1fr_1fr_5.5rem]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Nombre",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											defaultValue: c.name,
											onBlur: (e) => patchCorte(semester, i, { name: e.target.value }, updateSemester)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Inicio",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "date",
											defaultValue: c.startDate,
											onBlur: (e) => patchCorte(semester, i, { startDate: e.target.value }, updateSemester)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Fin",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "date",
											defaultValue: c.endDate,
											onBlur: (e) => patchCorte(semester, i, { endDate: e.target.value }, updateSemester)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Peso %",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											min: 0,
											max: 100,
											defaultValue: c.weight,
											onBlur: (e) => patchCorte(semester, i, { weight: Number(e.target.value) || 0 }, updateSemester)
										})
									})
								]
							}, c.index))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-xs text-ink-faint",
							children: [
								"Suma de pesos: ",
								semester.cortes.reduce((s, c) => s + c.weight, 0),
								"%"
							]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-4 font-display text-lg",
						children: "Notas del periodo"
					}), mine.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-ink-soft",
						children: "Todavía no hay materias."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "flex flex-col",
						children: mine.map((c) => {
							const g = computedFinalGrade(c, activities, semester, settings.gradeMax);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "border-b border-rule last:border-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/materias/$id",
									params: { id: c.id },
									className: "flex items-center gap-3 py-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "size-3 rounded-full",
											style: { background: c.color }
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "min-w-0 flex-1 truncate font-medium",
											children: c.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-ink-faint",
											children: [c.credits, " cr."]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradeChip, {
											value: g,
											max: settings.gradeMax,
											passing: settings.passingGrade
										})
									]
								})
							}, c.id);
						})
					})] })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mb-3 font-display text-lg",
							children: "Promedio ponderado"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GradeMeter, {
							value: avg,
							max: settings.gradeMax,
							passing: settings.passingGrade,
							size: 96,
							label: `Escala 0–${settings.gradeMax}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-ink-soft",
							children: avg == null ? "Carga notas de corte para ver el promedio." : `Promedio ${formatGrade(avg, settings.gradeMax)} con ${mine.reduce((s, c) => s + c.credits, 0)} créditos.`
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mb-3 font-display text-lg",
							children: "Escala"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Nota máxima",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
								value: settings.gradeMax,
								onChange: (e) => {
									const gradeMax = Number(e.target.value);
									updateSettings({
										gradeMax,
										passingGrade: gradeMax === 5 ? 3 : gradeMax === 10 ? 6 : 60
									});
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: 5,
										children: "0.0 – 5.0 (Colombia)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: 10,
										children: "0 – 10"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: 100,
										children: "0 – 100"
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Nota mínima para aprobar",
							className: "mt-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 0,
								max: settings.gradeMax,
								step: settings.gradeMax === 100 ? 1 : .1,
								defaultValue: settings.passingGrade,
								onBlur: (e) => updateSettings({ passingGrade: Number(e.target.value) })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Universidad (opcional)",
							className: "mt-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								defaultValue: settings.university,
								placeholder: "Nombre de la universidad",
								onBlur: (e) => updateSettings({ university: e.target.value })
							})
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mb-2 font-display text-lg",
							children: "Datos de ejemplo"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-4 text-sm text-ink-soft",
							children: "Esta vista arranca con un semestre 2026-2 de muestra. Puedes reemplazarlo o vaciar todo."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => {
									resetToSeed();
									toast.success("Se cargó el semestre de ejemplo");
								},
								children: "Restaurar ejemplo"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								className: "text-danger hover:bg-danger/10",
								onClick: () => {
									clearAll();
									toast.success("Tablero vacío. Crea un periodo para empezar.");
								},
								children: "Borrar todo"
							})]
						})
					] })
				]
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-ink-soft",
			children: "No hay periodos. Crea el primero."
		}) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Nuevo periodo" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Semestre o trimestre, con tres cortes por defecto." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewSemesterForm, {
				onCancel: () => setOpen(false),
				onCreate: (s) => {
					addSemester(s);
					toast.success("Periodo creado");
					setOpen(false);
				}
			})] })
		})
	] });
}
function Field({ label, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "mb-1.5 block",
			children: label
		}), children]
	});
}
function patchCorte(semester, index, patch, updateSemester) {
	const cortes = semester.cortes.map((c, i) => i === index ? {
		...c,
		...patch
	} : c);
	updateSemester(semester.id, { cortes });
}
function NewSemesterForm({ onCreate, onCancel }) {
	const year = (/* @__PURE__ */ new Date()).getFullYear();
	const [name, setName] = (0, import_react.useState)(`${year}-1`);
	const [type, setType] = (0, import_react.useState)("semestral");
	const [startDate, setStartDate] = (0, import_react.useState)(`${year}-02-03`);
	const [endDate, setEndDate] = (0, import_react.useState)(`${year}-06-14`);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "flex flex-col gap-3",
		onSubmit: (e) => {
			e.preventDefault();
			const cortes = defaultCortes(type, startDate, endDate);
			onCreate({
				name,
				type,
				startDate,
				endDate,
				cortes,
				isActive: true
			});
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Nombre",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: name,
					onChange: (e) => setName(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Tipo",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
					value: type,
					onChange: (e) => setType(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "semestral",
						children: "Semestral"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "trimestral",
						children: "Trimestral"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Inicio",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: startDate,
						onChange: (e) => setStartDate(e.target.value)
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Fin",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: endDate,
						onChange: (e) => setEndDate(e.target.value)
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-end gap-2 pt-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					onClick: onCancel,
					children: "Cancelar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					variant: "ink",
					children: "Crear"
				})]
			})
		]
	});
}
function defaultCortes(type, start, end) {
	const s = Date.parse(start);
	const e = Date.parse(end);
	const n = type === "trimestral" ? 2 : 3;
	const span = e - s;
	const weights = type === "trimestral" ? [50, 50] : [
		33,
		33,
		34
	];
	return Array.from({ length: n }, (_, i) => {
		const from = new Date(s + span * i / n);
		const to = new Date(s + span * (i + 1) / n);
		return {
			index: i,
			name: `Corte ${i + 1}`,
			startDate: toISODate(from),
			endDate: toISODate(to),
			weight: weights[i] ?? Math.round(100 / n)
		};
	});
}
//#endregion
export { PeriodoPage as component };
