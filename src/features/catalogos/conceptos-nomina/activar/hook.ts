import { useMutation, useQueryClient } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { activarConceptoNomina } from "./api"
export function useActivarConceptoNomina() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => activarConceptoNomina(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: catalogosKeys.conceptosNomina() }) },
  })
}