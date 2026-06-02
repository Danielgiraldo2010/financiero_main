import { useMutation, useQueryClient } from "@tanstack/react-query"
import { confirmarGiroPic } from "./api"
import { matriculasKeys } from "../../model/queryKeys"

export function useConfirmarGiroPic() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, fechaGiro, urlSoporte }: { id: number; fechaGiro: string; urlSoporte?: string | null }) =>
      confirmarGiroPic(id, { fechaGiro, urlSoporte: urlSoporte ?? null }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: matriculasKeys.coberturaPic() })
    },
  })
}
