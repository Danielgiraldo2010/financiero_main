import { useMutation, useQueryClient } from "@tanstack/react-query"
import { agendaKeys } from "../model/queryKeys"
import { actualizarEventoAgenda } from "./api"
import type { ActualizarEventoRequest } from "../model/types"

export const useActualizarEventoAgenda = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: ActualizarEventoRequest }) =>
      actualizarEventoAgenda(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: agendaKeys.all })
    },
  })
}
