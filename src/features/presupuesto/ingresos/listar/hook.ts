import { useQuery } from '@tanstack/react-query'
import { useTenantStore } from '@/shared/state/tenant.store'
import { presupuestoKeys } from '../../model/queryKeys'
import { fetchPresupuestoIngresos } from './api'
import type { PresupuestoLineasParams } from '../../model/types'

export function usePresupuestoIngresos(params: PresupuestoLineasParams = {}) {
  const tenantActivo = useTenantStore((s) => s.tenantActivo)
  const unidadEjecutoraId = tenantActivo?.id
  const fullParams = unidadEjecutoraId != null
    ? { ...params, unidadEjecutoraId }
    : params
  return useQuery({
    queryKey: presupuestoKeys.ingresos.list(fullParams),
    queryFn: () => fetchPresupuestoIngresos(fullParams),
    enabled: unidadEjecutoraId != null,
  })
}
