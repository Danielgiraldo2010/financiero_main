// features/integracion/sincronizaciones/log/hook.ts

import { useQuery } from "@tanstack/react-query"
import { integracionKeys } from "../../model/queryKeys"
import { listarSincronizaciones } from "./api"
import type { ListarSincronizacionesParams } from "./api"

export function useLogSincronizaciones(params: ListarSincronizacionesParams = {}) {
  return useQuery({
    queryKey: [...integracionKeys.sincronizaciones(), params],
    queryFn: () => listarSincronizaciones(params),
    select: (data) => data.items,
  })
}