import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { agendaKeys } from "../model/queryKeys"
import {
  listarAsignacionesEvento,
  agregarAsignacionEvento,
  eliminarAsignacionEvento,
  marcarVistoAsignacion,
} from "./api"
import type { AgregarAsignacionRequest } from "../model/types"

export const useAsignacionesEvento = (id: number) =>
  useQuery({
    queryKey: agendaKeys.asignaciones(id),
    queryFn: () => listarAsignacionesEvento(id),
    enabled: id > 0,
  })

export const useAgregarAsignacionEvento = (eventoId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: AgregarAsignacionRequest) =>
      agregarAsignacionEvento(eventoId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: agendaKeys.asignaciones(eventoId) })
    },
  })
}

export const useEliminarAsignacionEvento = (eventoId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (asignacionId: number) => eliminarAsignacionEvento(asignacionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: agendaKeys.asignaciones(eventoId) })
    },
  })
}

export const useMarcarVistoAsignacion = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (asignacionId: number) => marcarVistoAsignacion(asignacionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: agendaKeys.all })
    },
  })
}
