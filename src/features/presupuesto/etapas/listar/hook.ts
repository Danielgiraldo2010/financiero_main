// features/presupuesto/etapas/listar/hook.ts
import { useQuery } from '@tanstack/react-query'
import { useTenantStore } from '@/shared/state/tenant.store'
import { presupuestoKeys } from '../../model/queryKeys'
import { fetchEtapasAprobacion } from './api'

export function useEtapasAprobacion(vigencia: number) {
  const tenantActivo = useTenantStore((s) => s.tenantActivo)
  const unidadEjecutoraId = tenantActivo?.id

  return useQuery({
    queryKey: presupuestoKeys.etapas.byVigencia(vigencia),
    queryFn: () => fetchEtapasAprobacion(vigencia, unidadEjecutoraId),
    enabled: !!unidadEjecutoraId,
  })
}
