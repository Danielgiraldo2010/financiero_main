import { useMutation, useQueryClient } from "@tanstack/react-query"
import { normatividadKeys } from "../model/queryKeys"
import { reactivarNorma } from "./api"

export const useReactivarNorma = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => reactivarNorma(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: normatividadKeys.all })
    },
  })
}
