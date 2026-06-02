import { useMutation, useQueryClient } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { activarRubroGasto } from "./api"
export function useActivarRubroGasto() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => activarRubroGasto(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: catalogosKeys.rubrosGasto() }) },
  })
}