import { useMutation, useQueryClient } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { modificarApoyoMatricula } from "./api"
export function useModificarApoyoMatricula() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: modificarApoyoMatricula,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: catalogosKeys.apoyosMatricula() }) },
  })
}