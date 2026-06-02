// shared/lib/constants.ts
export const ROLES = {
  SUPERADMIN:         'SUPERADMIN',
  ADMIN_CENTRAL:      'ADMIN_CENTRAL',
  FINANCIERO_CENTRAL: 'FINANCIERO_CENTRAL',
  DECANO:             'DECANO',
  COORDINADOR:        'COORDINADOR',
  FINANCIERO:         'FINANCIERO',
  CONSULTOR:          'CONSULTOR',
} as const

export type Rol = (typeof ROLES)[keyof typeof ROLES]

// VIGENCIAS ya no es un array hardcodeado.
// Los componentes que importaban VIGENCIAS deben migrar a useVigencias():
//   import { useVigencias } from '@/features/catalogos/vigencias/listar/hook'
//
// Para evitar romper los 16 archivos existentes de golpe, se mantiene
// VIGENCIAS como fallback vacío durante la transición. El Header ya usa
// useVigencias directamente (ver Header.tsx).
// Una vez migrados todos los consumidores, eliminar estas líneas.
/** @deprecated Usar useVigencias() de '@/features/catalogos/vigencias/listar/hook' */
export const VIGENCIAS: readonly number[] = []
/** @deprecated Usar VigenciaResponse de '@/features/catalogos/vigencias/model/types' */
export type Vigencia = number

export const ESTADOS_PRESUPUESTO = {
  BORRADOR:            'BORRADOR',
  REVISADO:            'REVISADO',
  APROBADO_DECANO:     'APROBADO_DECANO',
  APROBADO_PLANEACION: 'APROBADO_PLANEACION',
  CONSOLIDADO:         'CONSOLIDADO',
  EN_EJECUCION:        'EN_EJECUCION',
  CERRADO:             'CERRADO',
} as const

export type EstadoPresupuesto = (typeof ESTADOS_PRESUPUESTO)[keyof typeof ESTADOS_PRESUPUESTO]

export const PAGE_SIZE_OPTIONS = [10, 25, 50] as const
export const DEFAULT_PAGE_SIZE    = 10
export const DEFAULT_DEBOUNCE_MS  = 300
