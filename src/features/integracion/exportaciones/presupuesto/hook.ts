// features/integracion/exportaciones/presupuesto/hook.ts

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { integracionKeys } from "../../model/queryKeys"
import { exportarPresupuesto } from "./api"
import { useEstadoSincronizacion } from "../../sincronizaciones/estado/hook"

export function useExportarPresupuesto() {
  const qc = useQueryClient()
  const [sincronizacionId, setSincronizacionId] = useState<number | null>(null)

  const mutacion = useMutation({
    mutationFn: exportarPresupuesto,
    onSuccess: (data) => {
      setSincronizacionId(data.id)
      qc.invalidateQueries({ queryKey: integracionKeys.sincronizaciones() })
    },
  })

  const pollingEstado = useEstadoSincronizacion(sincronizacionId)

  return {
    exportar: mutacion.mutate,
    isPending: mutacion.isPending,
    sincronizacionId,
    estado: pollingEstado.data,
    isPolling:
      pollingEstado.isFetching &&
      pollingEstado.data?.estado !== "COMPLETADO" &&
      pollingEstado.data?.estado !== "ERROR",
    reset: () => setSincronizacionId(null),
  }
}