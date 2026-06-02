import { useMutation, useQueryClient } from "@tanstack/react-query"
import { registrarBecaPosgrado } from "./api"
import { matriculasKeys } from "../../model/queryKeys"

export function useRegistrarBecaPosgrado() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: registrarBecaPosgrado,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: matriculasKeys.becasPosgrado() })
      qc.invalidateQueries({ queryKey: matriculasKeys.resumen(0) })
    },
  })
}
