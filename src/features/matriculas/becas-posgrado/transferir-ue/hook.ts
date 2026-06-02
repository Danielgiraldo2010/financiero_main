import { useMutation, useQueryClient } from "@tanstack/react-query"
import { registrarTransferenciaUE } from "./api"
import { matriculasKeys } from "../../model/queryKeys"

export function useRegistrarTransferenciaUE() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: { id: number; fechaResolucionMinisterio: string; fechaGiroMinisterio: string; fechaTransferenciaUe: string }) =>
      registrarTransferenciaUE(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: matriculasKeys.becasPosgrado() })
    },
  })
}
