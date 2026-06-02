import { useMutation, useQueryClient } from "@tanstack/react-query"
import { agendaKeys } from "../model/queryKeys"
import { completarEventoAgenda } from "./api"
import type { CompletarEventoRequest } from "../model/types"

export const useCompletarEventoAgenda = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: CompletarEventoRequest }) =>
      completarEventoAgenda(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: agendaKeys.all })
    },
  })
}
