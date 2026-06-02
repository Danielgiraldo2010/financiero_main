import type { RolUsuario } from './types'

/** Roles con acceso de escritura al módulo financiero */
export const ROLES_FINANCIEROS: RolUsuario[] = [
  'FINANCIERO',
  'FINANCIERO_CENTRAL',
  'ADMIN_CENTRAL',
  'SUPERADMIN',
]

/** Roles con capacidad de aprobar presupuesto */
export const ROLES_APROBADORES: RolUsuario[] = [
  'DECANO',
  'ADMIN_CENTRAL',
  'SUPERADMIN',
]

export function puedeAprobar(roles: string[]): boolean {
  return ROLES_APROBADORES.some((r) => roles.includes(r))
}

export function puedeEditar(roles: string[]): boolean {
  return ROLES_FINANCIEROS.some((r) => roles.includes(r))
}
