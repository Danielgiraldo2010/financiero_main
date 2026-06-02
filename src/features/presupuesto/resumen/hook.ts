// features/presupuesto/resumen/hook.ts
import { useQuery } from '@tanstack/react-query'
import { useTenantStore } from '@/shared/state/tenant.store'
import { presupuestoKeys } from '../model/queryKeys'
import { fetchResumenPresupuesto } from './api'

export function useResumenPresupuesto(vigencia: number) {
  const tenantActivo = useTenantStore((s) => s.tenantActivo)
  const unidadEjecutoraId = tenantActivo?.id

  return useQuery({
    queryKey: presupuestoKeys.resumen.byVigencia(vigencia),
    queryFn: () => fetchResumenPresupuesto(vigencia, unidadEjecutoraId),
    enabled: !!unidadEjecutoraId,
  })
}
