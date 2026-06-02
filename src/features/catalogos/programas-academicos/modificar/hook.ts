import { useMutation, useQueryClient } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { modificarProgramaAcademico } from "./api"
export function useModificarProgramaAcademico() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: modificarProgramaAcademico,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: catalogosKeys.programasAcademicos() }) },
  })
}