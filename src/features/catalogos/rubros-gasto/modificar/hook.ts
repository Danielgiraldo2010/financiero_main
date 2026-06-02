import { useMutation, useQueryClient } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { modificarRubroGasto } from "./api"
export function useModificarRubroGasto() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: modificarRubroGasto,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: catalogosKeys.rubrosGasto() }) },
  })
}