import { useMutation, useQueryClient } from "@tanstack/react-query"
import { normatividadKeys } from "../model/queryKeys"
import { derogarNorma } from "./api"

export const useDerogarNorma = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => derogarNorma(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: normatividadKeys.all })
    },
  })
}
