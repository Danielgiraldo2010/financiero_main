// ─── Labels legibles para selects y filtros ──────────────────────────────────

export const TIPO_EMPLEADO_LABELS: Record<string, string> = {
  PLANTA:           'Planta',
  OCASIONAL:        'Ocasional',
  CATEDRATICO:      'Catedrático',
  SUPERNUMERARIO:   'Supernumerario',
  PLANTA_TEMPORAL:  'Planta Temporal',
}

export const TIPO_EMPLEADO_OPTIONS = Object.entries(TIPO_EMPLEADO_LABELS).map(
  ([value, label]) => ({ value, label })
)

// Tipos habilitados para asignación a plan de clases (usado en FE7-B)
export const TIPOS_EMPLEADO_PLAN_CLASES = [
  'CATEDRATICO',
  'SUPERNUMERARIO',
  'PLANTA_TEMPORAL',
] as const
