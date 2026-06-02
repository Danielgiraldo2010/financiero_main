import { useMutation, useQueryClient } from "@tanstack/react-query"
import { agendaKeys } from "../model/queryKeys"
import { crearEventoAgenda } from "./api"

export const useCrearEventoAgenda = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: crearEventoAgenda,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: agendaKeys.all })
    },
  })
}
