import { useMutation, useQueryClient } from "@tanstack/react-query"
import { anularCohorte } from "./api"
import { matriculasKeys } from "../../model/queryKeys"

export function useAnularCohorte() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, motivo }: { id: number; motivo: string }) =>
      anularCohorte(id, motivo),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: matriculasKeys.cohortes() })
    },
  })
}
