import { useMutation, useQueryClient } from "@tanstack/react-query"
import { normatividadKeys } from "../model/queryKeys"
import { agregarProcesoNorma, eliminarProcesoNorma } from "./api"
import type { AgregarProcesoRequest } from "../model/types"

export const useAgregarProcesoNorma = (normaId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: AgregarProcesoRequest) => agregarProcesoNorma(normaId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: normatividadKeys.detalle(normaId) })
      qc.invalidateQueries({ queryKey: normatividadKeys.all })
    },
  })
}

export const useEliminarProcesoNorma = (normaId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (procesoId: number) => eliminarProcesoNorma(procesoId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: normatividadKeys.detalle(normaId) })
      qc.invalidateQueries({ queryKey: normatividadKeys.all })
    },
  })
}
