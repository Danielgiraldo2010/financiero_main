import { useQuery } from "@tanstack/react-query"
import { dashboardKeys } from "../../model/queryKeys"
import { getEventosVencidos } from "./api"

export function useEventosVencidos() {
  return useQuery({
    queryKey: dashboardKeys.eventosVencidos(),
    queryFn: getEventosVencidos,
    staleTime: 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  })
}
