import { useMutation, useQueryClient } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { activarProgramaAcademico } from "./api"
export function useActivarProgramaAcademico() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => activarProgramaAcademico(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: catalogosKeys.programasAcademicos() }) },
  })
}