// =============================================================================
// Constantes de UI — sincronizadas con EstadoModificacion real del backend
//
// Semáforo de color:
//   🟡 PENDIENTE          → secondary  (amarillo/gris — en trámite)
//   🟢 APROBADA_DECANO    → default    (azul/verde — 1ª firma OK)
//   🟢 APROBADA_PLANEACION → outline   (verde intenso — modificación aplicada)
//   🔴 RECHAZADA          → destructive (rojo)
// =============================================================================
import type { EstadoModificacion } from './types'

export const ESTADO_MODIFICACION_LABELS: Record<EstadoModificacion, string> = {
  PENDIENTE:            'Pendiente',
  APROBADA_DECANO:      'Aprobada — Decano',
  APROBADA_PLANEACION:  'Aprobada — Planeación',
  RECHAZADA:            'Rechazada',
}

// Tooltip descriptivo para el semáforo (hover)
export const ESTADO_MODIFICACION_TOOLTIP: Record<EstadoModificacion, string> = {
  PENDIENTE:            'Esperando 1ª firma del Decano',
  APROBADA_DECANO:      '1ª firma OK — esperando refrendo de Planeación',
  APROBADA_PLANEACION:  'Modificación aplicada al presupuesto',
  RECHAZADA:            'Solicitud rechazada — cerrada',
}

// Variantes de Badge (shadcn/ui)
export const ESTADO_MODIFICACION_VARIANTS: Record<
  EstadoModificacion,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  PENDIENTE:            'secondary',
  APROBADA_DECANO:      'default',
  APROBADA_PLANEACION:  'outline',
  RECHAZADA:            'destructive',
}

// Colores del indicador de semáforo (dot visual en la tabla)
export const ESTADO_MODIFICACION_DOT: Record<EstadoModificacion, string> = {
  PENDIENTE:            'bg-yellow-400',
  APROBADA_DECANO:      'bg-blue-500',
  APROBADA_PLANEACION:  'bg-green-600',
  RECHAZADA:            'bg-red-500',
}

export const TIPOS_MODIFICACION = [
  { value: 'TRASLADO_INTERNO',  label: 'Traslado interno'  },
  { value: 'ADICION',           label: 'Adición'            },
  { value: 'REDUCCION',         label: 'Reducción'          },
  { value: 'CREDITO_ADICIONAL', label: 'Crédito adicional'  },
] as const