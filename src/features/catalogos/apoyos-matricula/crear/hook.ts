import { useMutation, useQueryClient } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { crearApoyoMatricula } from "./api"
export function useCrearApoyoMatricula() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: crearApoyoMatricula,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: catalogosKeys.apoyosMatricula() }) },
  })
}