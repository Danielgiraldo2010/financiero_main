import { useMutation, useQueryClient } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { cerrarPeriodoAcademico } from "./api"

export function useCerrarPeriodoAcademico() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => cerrarPeriodoAcademico(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogosKeys.periodosAcademicos() })
    },
  })
}
