export const ESTADOS_CATALOGO = ["ACTIVO", "INACTIVO"] as const
export type EstadoCatalogo = typeof ESTADOS_CATALOGO[number]

export const NIVELES_PROGRAMA = [
  "PREGRADO",
  "ESPECIALIZACION",
  "MAESTRIA",
  "DOCTORADO",
  "TECNICO",
  "TECNOLOGICO",
] as const

export const TIPOS_FUENTE = [
  "PROPIA",
  "TRANSFERENCIA",
  "ESTAMPILLA",
  "CREDITO",
  "COFINANCIACION",
] as const

export const TIPOS_LIMITE = [
  "PRESUPUESTO",
  "NOMINA",
  "CONTRATACION",
  "MATRICULAS",
  "CIERRE",
] as const

export const TIPOS_GASTO = [
  "PERSONAL",
  "GENERALES",
  "TRANSFERENCIAS",
  "INVERSIONES",
] as const
