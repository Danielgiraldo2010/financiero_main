// features/integracion/sincronizaciones/ejecutar/hook.ts

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { integracionKeys } from "../../model/queryKeys"
import { ejecutarSincronizacion } from "./api"

export function useEjecutarSincronizacion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ejecutarSincronizacion,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: integracionKeys.sincronizaciones() }),
  })
}