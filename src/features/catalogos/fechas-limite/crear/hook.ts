import { useMutation, useQueryClient } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { crearFechaLimite } from "./api"

export function useCrearFechaLimite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: crearFechaLimite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogosKeys.fechasLimite() })
    },
  })
}
