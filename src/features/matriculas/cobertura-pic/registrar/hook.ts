import { useMutation, useQueryClient } from "@tanstack/react-query"
import { registrarCoberturaPic } from "./api"
import { matriculasKeys } from "../../model/queryKeys"

export function useRegistrarCoberturaPic() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: registrarCoberturaPic,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: matriculasKeys.coberturaPic() })
    },
  })
}
