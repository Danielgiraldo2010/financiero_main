import { useMutation, useQueryClient } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { crearConceptoNomina } from "./api"
export function useCrearConceptoNomina() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: crearConceptoNomina,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: catalogosKeys.conceptosNomina() }) },
  })
}