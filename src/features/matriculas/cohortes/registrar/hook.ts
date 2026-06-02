import { useMutation, useQueryClient } from "@tanstack/react-query"
import { registrarCohorte } from "./api"
import { matriculasKeys } from "../../model/queryKeys"

export function useRegistrarCohorte() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: registrarCohorte,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: matriculasKeys.all })
    },
  })
}
