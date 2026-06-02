// features/integracion/sincronizaciones/estado/hook.ts
// Polling hasta que el estado sea terminal (COMPLETADO | ERROR)

import { useQuery } from "@tanstack/react-query"
import { integracionKeys } from "../../model/queryKeys"
import { consultarEstadoSincronizacion } from "./api"
import type { EstadoSincronizacion } from "../../model/types"

const ESTADOS_TERMINALES: EstadoSincronizacion[] = ["COMPLETADO", "ERROR"]

export function useEstadoSincronizacion(id: number | null) {
  return useQuery({
    queryKey: integracionKeys.sincronizacion(id ?? 0),
    queryFn: () => consultarEstadoSincronizacion(id!),
    enabled: id !== null && id > 0,
    refetchInterval: (query) => {
      const estado = query.state.data?.estado
      if (!estado || ESTADOS_TERMINALES.includes(estado)) return false
      return 3000
    },
  })
}