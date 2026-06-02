import { useMutation, useQueryClient } from "@tanstack/react-query"
import { normatividadKeys } from "../model/queryKeys"
import { registrarNorma } from "./api"

export const useRegistrarNorma = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: registrarNorma,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: normatividadKeys.all })
    },
  })
}
