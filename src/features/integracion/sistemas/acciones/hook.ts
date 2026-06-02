// features/integracion/sistemas/acciones/hook.ts

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { integracionKeys } from "../../model/queryKeys"
import { activarSistema, desactivarSistema } from "./api"

export function useActivarSistema() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: activarSistema,
    onSuccess: () => qc.invalidateQueries({ queryKey: integracionKeys.sistemas() }),
  })
}

export function useDesactivarSistema() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: desactivarSistema,
    onSuccess: () => qc.invalidateQueries({ queryKey: integracionKeys.sistemas() }),
  })
}