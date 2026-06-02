import { useMutation, useQueryClient } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { activarRubroIngreso } from "./api"
export function useActivarRubroIngreso() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => activarRubroIngreso(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: catalogosKeys.rubrosIngreso() }) },
  })
}