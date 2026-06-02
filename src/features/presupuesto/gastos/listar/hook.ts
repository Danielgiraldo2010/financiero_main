import { useQuery } from '@tanstack/react-query'
import { useTenantStore } from '@/shared/state/tenant.store'
import { presupuestoKeys } from '../../model/queryKeys'
import { fetchPresupuestoGastos } from './api'
import type { PresupuestoLineasParams } from '../../model/types'

export function usePresupuestoGastos(params: PresupuestoLineasParams = {}) {
  const tenantActivo = useTenantStore((s) => s.tenantActivo)
  const unidadEjecutoraId = tenantActivo?.id
  const fullParams = unidadEjecutoraId != null
    ? { ...params, unidadEjecutoraId }
    : params
  return useQuery({
    queryKey: presupuestoKeys.gastos.list(fullParams),
    queryFn: () => fetchPresupuestoGastos(fullParams),
    enabled: unidadEjecutoraId != null,
  })
}
