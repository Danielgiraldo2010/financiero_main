import { useMutation, useQueryClient } from "@tanstack/react-query"
import { dashboardKeys } from "../../model/queryKeys"
import { generarAlertas } from "./api"

export function useGenerarAlertas() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: generarAlertas,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.alertas() })
    },
  })
}
