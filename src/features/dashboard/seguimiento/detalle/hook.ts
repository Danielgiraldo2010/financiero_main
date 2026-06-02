import { useQuery } from "@tanstack/react-query"
import { dashboardKeys } from "../../model/queryKeys"
import { getEventoSeguimiento } from "./api"

export function useEventoSeguimiento(id: number) {
  return useQuery({
    queryKey: dashboardKeys.eventoDetail(id),
    queryFn: () => getEventoSeguimiento(id),
    enabled: id > 0,
  })
}
