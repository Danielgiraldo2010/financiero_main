import { useMutation, useQueryClient } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { crearRubroIngreso } from "./api"

export function useCrearRubroIngreso() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: crearRubroIngreso,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogosKeys.rubrosIngreso() })
    },
  })
}
