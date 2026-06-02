import { useMutation, useQueryClient } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { crearRubroGasto } from "./api"

export function useCrearRubroGasto() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: crearRubroGasto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogosKeys.rubrosGasto() })
    },
  })
}
