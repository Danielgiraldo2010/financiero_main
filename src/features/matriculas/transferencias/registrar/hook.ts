import { useMutation, useQueryClient } from "@tanstack/react-query"
import { registrarTransferencia } from "./api"
import { matriculasKeys } from "../../model/queryKeys"

export function useRegistrarTransferencia() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: registrarTransferencia,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: matriculasKeys.transferencias() })
    },
  })
}
