import { useMutation, useQueryClient } from "@tanstack/react-query"
import { agendaKeys } from "../model/queryKeys"
import { cancelarEventoAgenda } from "./api"
import type { CancelarEventoRequest } from "../model/types"

export const useCancelarEventoAgenda = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: CancelarEventoRequest }) =>
      cancelarEventoAgenda(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: agendaKeys.all })
    },
  })
}
