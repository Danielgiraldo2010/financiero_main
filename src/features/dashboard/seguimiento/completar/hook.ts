import { useMutation, useQueryClient } from "@tanstack/react-query"
import { dashboardKeys } from "../../model/queryKeys"
import { completarEvento } from "./api"

export function useCompletarEvento() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => completarEvento(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.eventos() })
    },
  })
}
