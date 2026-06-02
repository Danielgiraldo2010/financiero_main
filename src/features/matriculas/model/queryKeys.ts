export const matriculasKeys = {
  all: ["matriculas"] as const,

  // Cohortes
  cohortes: (filters?: object) =>
    [...matriculasKeys.all, "cohortes", filters] as const,
  cohorteDetalle: (id: number) =>
    [...matriculasKeys.all, "cohortes", id] as const,

  // Resumen
  resumen: (vigencia: number, periodo?: string) =>
    [...matriculasKeys.all, "resumen", vigencia, periodo] as const,

  // Transferencias
  transferencias: (filters?: object) =>
    [...matriculasKeys.all, "transferencias", filters] as const,

  // Cobertura PIC
  coberturaPic: (vigencia?: number) =>
    [...matriculasKeys.all, "cobertura-pic", vigencia] as const,

  // Becas Posgrado
  becasPosgrado: (filters?: object) =>
    [...matriculasKeys.all, "becas-posgrado", filters] as const,
} as const