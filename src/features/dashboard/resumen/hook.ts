import { useQuery } from "@tanstack/react-query"
import { dashboardKeys } from "../model/queryKeys"
import { getResumenEjecutivo, getKPIs, getAgenda } from "./api"
import type { DashboardParams } from "../model/types"

const STALE_2MIN = 2 * 60 * 1000

export function useResumenEjecutivo(params?: DashboardParams) {
  return useQuery({
    queryKey: dashboardKeys.resumen(params),
    queryFn: () => getResumenEjecutivo(params),
    staleTime: STALE_2MIN,
    refetchInterval: STALE_2MIN,
  })
}

export function useKPIs(params?: DashboardParams) {
  return useQuery({
    queryKey: dashboardKeys.kpis(params),
    queryFn: () => getKPIs(params),
    staleTime: STALE_2MIN,
    refetchInterval: STALE_2MIN,
  })
}

export function useAgenda() {
  return useQuery({
    queryKey: dashboardKeys.agenda(),
    queryFn: getAgenda,
    staleTime: STALE_2MIN,
  })
}
