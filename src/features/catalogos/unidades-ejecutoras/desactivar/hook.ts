import { useMutation, useQueryClient } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { desactivarUnidadEjecutora } from "./api"

export function useDesactivarUnidadEjecutora() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => desactivarUnidadEjecutora(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogosKeys.unidadesEjecutoras() })
    },
  })
}
