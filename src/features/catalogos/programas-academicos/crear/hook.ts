import { useMutation, useQueryClient } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { crearProgramaAcademico } from "./api"

export function useCrearProgramaAcademico() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: crearProgramaAcademico,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogosKeys.programasAcademicos() })
    },
  })
}
