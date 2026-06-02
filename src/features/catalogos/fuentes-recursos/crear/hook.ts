import { useMutation, useQueryClient } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { crearFuenteRecurso } from "./api"

export function useCrearFuenteRecurso() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: crearFuenteRecurso,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogosKeys.fuentesRecursos() })
    },
  })
}
