// INVARIANTE I6: exactamente los 7 tipos del Manual de Presupuesto 2026
export const TIPOS_MATRICULA = [
  {
    value: "R30",
    label: "Gratuidad Nación",
    descripcion: "Art. 86 Ley 30/1992 — Gratuidad financiada por transferencia Nación (R30)",
    requiereTransferenciaInterna: false,
    requiereCoberturaPic: false,
    requiereMunicipio: false,
  },
  {
    value: "R24_PAGO_DIRECTO",
    label: "Pago Directo (R24)",
    descripcion: "Matrícula financiada directamente por el estudiante — rubro R24",
    requiereTransferenciaInterna: false,
    requiereCoberturaPic: false,
    requiereMunicipio: false,
  },
  {
    value: "R24_CONVENIO",
    label: "Convenio (R24)",
    descripcion: "Matrícula cubierta por convenio interinstitucional — rubro R24",
    requiereTransferenciaInterna: true,
    requiereCoberturaPic: false,
    requiereMunicipio: false,
  },
  {
    value: "R24_ESTAMPILLA",
    label: "Estampilla (R24)",
    descripcion: "Matrícula financiada con recursos de Estampilla Pro-Universidad",
    requiereTransferenciaInterna: true,
    requiereCoberturaPic: false,
    requiereMunicipio: false,
  },
  {
    value: "PIC",
    label: "PIC — Programa de Infraestructura Caldas",
    descripcion: "Solo para municipios ≠ Manizales. Requiere cobertura PIC registrada.",
    requiereTransferenciaInterna: false,
    requiereCoberturaPic: true,
    requiereMunicipio: true,           // INVARIANTE I2
  },
  {
    value: "MINCIENCIAS",
    label: "Becas Minciencias",
    descripcion: "Becas de posgrado financiadas por convocatoria Minciencias",
    requiereTransferenciaInterna: false,
    requiereCoberturaPic: false,
    requiereMunicipio: false,
  },
  {
    value: "OTRO",
    label: "Otro",
    descripcion: "Fuente de ingreso no clasificada en las anteriores categorías",
    requiereTransferenciaInterna: false,
    requiereCoberturaPic: false,
    requiereMunicipio: false,
  },
] as const

export type TipoMatriculaValue = (typeof TIPOS_MATRICULA)[number]["value"]

export const MUNICIPIO_MANIZALES_ID = 17001  // Código DIVIPOLA — validación I2

export const ESTADO_GIRO_LABELS: Record<string, string> = {
  PENDIENTE: "Pendiente",
  GIRADO: "Girado",
  CONFIRMADO: "Confirmado",
  ANULADO: "Anulado",
}

export const TIPO_TRANSFERENCIA_LABELS: Record<string, string> = {
  GRATUIDAD: "Gratuidad",
  ESTAMPILLA: "Estampilla",
  CONVENIO: "Convenio",
  OTRO: "Otro",
}
