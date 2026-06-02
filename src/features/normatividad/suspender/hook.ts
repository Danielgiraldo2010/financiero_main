import { useMutation, useQueryClient } from "@tanstack/react-query"
import { normatividadKeys } from "../model/queryKeys"
import { suspenderNorma } from "./api"

export const useSuspenderNorma = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => suspenderNorma(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: normatividadKeys.all })
    },
  })
}
