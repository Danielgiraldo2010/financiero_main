import { useMutation, useQueryClient } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { desactivarRubroIngreso } from "./api"
export function useDesactivarRubroIngreso() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => desactivarRubroIngreso(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: catalogosKeys.rubrosIngreso() }) },
  })
}