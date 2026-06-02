import { useMutation, useQueryClient } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { desactivarConceptoNomina } from "./api"
export function useDesactivarConceptoNomina() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => desactivarConceptoNomina(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: catalogosKeys.conceptosNomina() }) },
  })
}