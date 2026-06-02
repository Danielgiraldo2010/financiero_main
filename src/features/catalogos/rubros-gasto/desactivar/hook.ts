import { useMutation, useQueryClient } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { desactivarRubroGasto } from "./api"
export function useDesactivarRubroGasto() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => desactivarRubroGasto(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: catalogosKeys.rubrosGasto() }) },
  })
}