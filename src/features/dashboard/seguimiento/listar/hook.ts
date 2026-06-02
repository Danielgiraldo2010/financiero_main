import { useQuery } from "@tanstack/react-query"
import { dashboardKeys } from "../../model/queryKeys"
import { getEventosSeguimiento } from "./api"
import type { EventosSeguimientoParams } from "../../model/types"

export function useEventosSeguimiento(params?: EventosSeguimientoParams) {
  return useQuery({
    queryKey: dashboardKeys.eventosList(params),
    queryFn: () => getEventosSeguimiento(params),
  })
}
