import { useMutation, useQueryClient } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { modificarFechaLimite } from "./api"
export function useModificarFechaLimite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: modificarFechaLimite,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: catalogosKeys.fechasLimite() }) },
  })
}