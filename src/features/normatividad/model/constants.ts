export const TIPOS_NORMA = [
  "LEY",
  "DECRETO",
  "ACUERDO",
  "RESOLUCION",
  "CIRCULAR",
  "OTRO",
] as const

export const AMBITOS_NORMA = [
  "NACIONAL",
  "DEPARTAMENTAL",
  "MUNICIPAL",
  "INSTITUCIONAL",
] as const

export const DOMINIOS_NORMA = [
  "NOMINA",
  "VIATICOS",
  "MATRICULAS",
  "PRESUPUESTO",
  "GENERAL",
] as const

export const ESTADOS_NORMA = ["VIGENTE", "DEROGADA", "SUSPENDIDA"] as const

export const BADGE_ESTADO_NORMA: Record<string, string> = {
  VIGENTE: "bg-green-50 text-green-700",
  SUSPENDIDA: "bg-yellow-50 text-yellow-700",
  DEROGADA: "bg-red-50 text-red-700 line-through",
}
