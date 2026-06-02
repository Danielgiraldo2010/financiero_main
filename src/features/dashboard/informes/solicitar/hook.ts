import { useMutation, useQueryClient } from "@tanstack/react-query"
import { dashboardKeys } from "../../model/queryKeys"
import { solicitarInforme } from "./api"

export function useSolicitarInforme() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: solicitarInforme,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.informes() })
    },
  })
}
