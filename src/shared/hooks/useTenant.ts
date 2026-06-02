import { useTenantStore } from '@/shared/state/tenant.store'

/**
 * Acceso conveniente al tenant activo.
 */
export function useTenant() {
  const tenantActivo = useTenantStore((s) => s.tenantActivo)
  const cambiarTenant = useTenantStore((s) => s.cambiarTenant)
  const unidadesDisponibles = useTenantStore((s) => s.unidadesDisponibles)
  return { tenantActivo, cambiarTenant, unidadesDisponibles }
}
