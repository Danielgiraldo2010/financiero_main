import { useMutation, useQueryClient } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { modificarPeriodoAcademico } from "./api"
export function useModificarPeriodoAcademico() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: modificarPeriodoAcademico,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: catalogosKeys.periodosAcademicos() }) },
  })
}