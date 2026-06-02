import { useMutation, useQueryClient } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { modificarRubroIngreso } from "./api"
export function useModificarRubroIngreso() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: modificarRubroIngreso,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: catalogosKeys.rubrosIngreso() }) },
  })
}