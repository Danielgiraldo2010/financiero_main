import { useMutation, useQueryClient } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { modificarConceptoNomina } from "./api"
export function useModificarConceptoNomina() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: modificarConceptoNomina,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: catalogosKeys.conceptosNomina() }) },
  })
}