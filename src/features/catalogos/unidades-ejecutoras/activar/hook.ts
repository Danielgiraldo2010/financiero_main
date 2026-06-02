import { useMutation, useQueryClient } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { activarUnidadEjecutora } from "./api"

export function useActivarUnidadEjecutora() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => activarUnidadEjecutora(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogosKeys.unidadesEjecutoras() })
    },
  })
}
