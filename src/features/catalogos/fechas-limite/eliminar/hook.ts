import { useMutation, useQueryClient } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { eliminarFechaLimite } from "./api"
export function useEliminarFechaLimite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => eliminarFechaLimite(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: catalogosKeys.fechasLimite() }) },
  })
}