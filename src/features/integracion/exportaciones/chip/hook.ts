// features/integracion/exportaciones/chip/hook.ts
// Inicia exportación CHIP y activa polling de estado via useEstadoSincronizacion

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { integracionKeys } from "../../model/queryKeys"
import { exportarCHIP } from "./api"
import { useEstadoSincronizacion } from "../../sincronizaciones/estado/hook"

export function useExportarCHIP() {
  const qc = useQueryClient()
  const [sincronizacionId, setSincronizacionId] = useState<number | null>(null)

  const mutacion = useMutation({
    mutationFn: exportarCHIP,
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