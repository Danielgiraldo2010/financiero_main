import { useMutation, useQueryClient } from "@tanstack/react-query"
import { dashboardKeys } from "../../model/queryKeys"
import { desactivarAlerta } from "./api"

export function useDesactivarAlerta() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => desactivarAlerta(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.alertas() })
    },
  })
}
