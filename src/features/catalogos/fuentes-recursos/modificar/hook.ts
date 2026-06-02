import { useMutation, useQueryClient } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { modificarFuenteRecurso } from "./api"
export function useModificarFuenteRecurso() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: modificarFuenteRecurso,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: catalogosKeys.fuentesRecursos() }) },
  })
}