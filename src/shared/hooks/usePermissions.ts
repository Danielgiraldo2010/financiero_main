import { useAuthStore } from '@/shared/state/auth.store'
import { ROLES } from '@/shared/lib/constants'

/**
 * Lee roles desde auth.store — no hace fetch (FE0-I10).
 */
export function usePermissions() {
  const roles = useAuthStore((s) => s.roles)

  const hasRole = (role: string | string[]): boolean => {
    if (Array.isArray(role)) return role.some((r) => roles.includes(r))
    return roles.includes(role)
  }

  const isAdmin = (): boolean =>
    hasRole([ROLES.ADMIN_CENTRAL, ROLES.SUPERADMIN])

  const isSuperAdmin = (): boolean =>
    hasRole(ROLES.SUPERADMIN)

  // canView: lógica de visibilidad por recurso — extender según reglas de negocio
  const canView = (resource: string): boolean => {
    if (isSuperAdmin()) return true
    // Ejemplo base — cada feature puede añadir reglas específicas
    const publicResources = ['dashboard', 'perfil']
    if (publicResources.includes(resource)) return true
    return isAdmin()
  }

  return { hasRole, canView, isAdmin, isSuperAdmin }
}
