import { useQuery } from "@tanstack/react-query"
import { dashboardKeys } from "../model/queryKeys"
import { getEstadoProyectos } from "./api"
import type { DashboardParams } from "../model/types"

export function useEstadoProyectos(params?: DashboardParams) {
  return useQuery({
    queryKey: dashboardKeys.semaforo(params),
    queryFn: () => getEstadoProyectos(params),
    staleTime: 2 * 60 * 1000,
  })
}
