import { useMutation, useQueryClient } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { desactivarProgramaAcademico } from "./api"
export function useDesactivarProgramaAcademico() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => desactivarProgramaAcademico(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: catalogosKeys.programasAcademicos() }) },
  })
}