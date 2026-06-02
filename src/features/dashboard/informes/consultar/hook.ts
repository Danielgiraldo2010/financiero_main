import { useQuery } from "@tanstack/react-query"
import { dashboardKeys } from "../../model/queryKeys"
import { getEstadoInforme, getTiposInforme } from "./api"
import type { EstadoInforme } from "../../model/types"

const ESTADOS_FINALES: EstadoInforme[] = ["LISTO", "ERROR"]

// FE11-I2: polling cada 3s, se detiene al llegar a estado final
export function useEstadoInforme(id: string) {
  return useQuery({
    queryKey: dashboardKeys.informeDetail(id),
    queryFn: () => getEstadoInforme(id),
    enabled: id.length > 0,
    refetchInterval: (query) => {
      const estado = query.state.data?.estado
      if (estado && ESTADOS_FINALES.includes(estado)) return false
      return 3000
    },
  })
}

export function useTiposInforme() {
  return useQuery({
    queryKey: dashboardKeys.informesTipos(),
    queryFn: getTiposInforme,
    staleTime: Infinity,
  })
}
