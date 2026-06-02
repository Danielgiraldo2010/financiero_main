// features/presupuesto/techo/listar/hook.ts
import { useQuery } from '@tanstack/react-query'
import { useTenantStore } from '@/shared/state/tenant.store'
import { presupuestoKeys } from '../../model/queryKeys'
import { fetchTechosPresupuestales } from './api'

export function useTechoPresupuestal(vigencia: number) {
  const tenantActivo = useTenantStore((s) => s.tenantActivo)
  const unidadEjecutoraId = tenantActivo?.id

  return useQuery({
    queryKey: presupuestoKeys.techo.byVigencia(vigencia),
    queryFn: () => fetchTechosPresupuestales(vigencia, unidadEjecutoraId),
    enabled: !!unidadEjecutoraId,
  })
}
