// src\features\proyectos\model\constants.ts
import type { EstadoPresupuesto, EstadoProyecto, CategoriaProyecto } from './types'

// ─── Semáforo de estado ───────────────────────────────────────────────────────
export type SemaforoColor = 'green' | 'yellow' | 'red' | 'gray'

export const SEMAFORO_MAP: Record<EstadoPresupuesto, SemaforoColor> = {
  EN_EJECUCION:        'green',
  CONSOLIDADO:         'green',
  APROBADO_PLANEACION: 'yellow',
  APROBADO_DECANO:     'yellow',
  REVISADO:            'yellow',
  BORRADOR:            'yellow',
  SIN_PRESUPUESTO:     'red',
  CERRADO:             'gray',
}

export const SEMAFORO_HEX: Record<SemaforoColor, string> = {
  green:  '#16a34a',
  yellow: '#ca8a04',
  red:    '#dc2626',
  gray:   '#6b7280',
}

// ─── Labels legibles ──────────────────────────────────────────────────────────
export const ESTADO_PRESUPUESTO_LABEL: Record<EstadoPresupuesto, string> = {
  SIN_PRESUPUESTO:     'Sin presupuesto',
  BORRADOR:            'Borrador',
  REVISADO:            'Revisado',
  APROBADO_DECANO:     'Aprobado Decano',
  APROBADO_PLANEACION: 'Aprobado Planeación',
  CONSOLIDADO:         'Consolidado',
  EN_EJECUCION:        'En ejecución',
  CERRADO:             'Cerrado',
}

export const ESTADO_PROYECTO_LABEL: Record<EstadoProyecto, string> = {
  ACTIVO:  'Activo',
  ANULADO: 'Anulado',
  CERRADO: 'Cerrado',
}

// ─── Categorías de proyecto (v5) ──────────────────────────────────────────────
export const CATEGORIA_PROYECTO_LABEL: Record<CategoriaProyecto, string> = {
  ESPECIAL:       'Especial (fondos propios)',
  ESTRATEGICO:    'Estratégico',
  INVERSION:      'Inversión',
  MISIONAL:       'Misional',
  FUNCIONAMIENTO: 'Funcionamiento',
}

// ─── Tabs del detalle ─────────────────────────────────────────────────────────
export const PROYECTO_TABS = [
  { value: 'info',        label: 'Información' },
  { value: 'presupuesto', label: 'Presupuesto' },
  { value: 'contratos',   label: 'Contratos' },
  { value: 'cartera',     label: 'Cartera' },
  { value: 'documentos',  label: 'Documentos' },
  { value: 'timeline',    label: 'Línea de tiempo' },
] as const

export type ProyectoTab = (typeof PROYECTO_TABS)[number]['value']