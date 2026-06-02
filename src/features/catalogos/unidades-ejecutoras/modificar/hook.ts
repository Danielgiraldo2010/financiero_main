import { useMutation, useQueryClient } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { modificarUnidadEjecutora } from "./api"

export function useModificarUnidadEjecutora() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: modificarUnidadEjecutora,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogosKeys.unidadesEjecutoras() })
    },
  })
}
