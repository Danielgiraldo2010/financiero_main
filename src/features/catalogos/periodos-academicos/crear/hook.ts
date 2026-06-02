import { useMutation, useQueryClient } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { crearPeriodoAcademico } from "./api"

export function useCrearPeriodoAcademico() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: crearPeriodoAcademico,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogosKeys.periodosAcademicos() })
    },
  })
}
