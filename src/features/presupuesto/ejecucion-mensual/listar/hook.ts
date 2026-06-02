import { useQuery } from '@tanstack/react-query'
import { useTenantStore } from '@/shared/state/tenant.store'
import { presupuestoKeys } from '../../model/queryKeys'
import { fetchEjecucionMensual } from './api'
import type { EjecucionMensualParams } from '../../model/types'

export function useEjecucionMensual(params: EjecucionMensualParams = {}) {
  const tenantActivo = useTenantStore((s) => s.tenantActivo)
  const unidadEjecutoraId = tenantActivo?.id

  const fullParams = unidadEjecutoraId != null
    ? { ...params, unidadEjecutoraId }
    : params

  return useQuery({
    queryKey: presupuestoKeys.ejecucionMensual.byParams(fullParams),
    queryFn: () => fetchEjecucionMensual(fullParams),
    enabled: unidadEjecutoraId != null,
  })
}
