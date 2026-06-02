// presupuesto/model/queryKeys.ts
// Factory de query keys para el presupuesto por proyecto.
// Jerarquía: ["presupuesto-proyecto", "detail", proyectoId]

export const presupuestoProyectoKeys = {
  all: ["presupuesto-proyecto"] as const,

  details: () => [...presupuestoProyectoKeys.all, "detail"] as const,

  detail: (proyectoId: number) =>
    [...presupuestoProyectoKeys.details(), proyectoId] as const,
}
