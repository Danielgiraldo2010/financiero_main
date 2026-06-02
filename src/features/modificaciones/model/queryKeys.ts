// =============================================================================
// Query Keys factory — jerarquía estándar [dominio, tipo, parámetros]
// Todos los valores son serializables (sin funciones ni clases)
// =============================================================================
import type { ModificacionesParams } from './types'

export const modificacionesKeys = {
  all: ['modificaciones'] as const,

  lists: () => [...modificacionesKeys.all, 'list'] as const,
  list:  (params: ModificacionesParams) =>
    [...modificacionesKeys.lists(), params] as const,

  details: () => [...modificacionesKeys.all, 'detail'] as const,
  detail:  (id: number) => [...modificacionesKeys.details(), id] as const,

  lineas:   (id: number) => [...modificacionesKeys.detail(id), 'lineas']   as const,
  timeline: (id: number) => [...modificacionesKeys.detail(id), 'timeline'] as const,
}
