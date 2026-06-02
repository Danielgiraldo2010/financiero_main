import { useMutation, useQueryClient } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { crearUnidadEjecutora } from "./api"

export function useCrearUnidadEjecutora() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: crearUnidadEjecutora,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogosKeys.unidadesEjecutoras() })
    },
  })
}
