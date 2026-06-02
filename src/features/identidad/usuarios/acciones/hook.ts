import { useMutation, useQueryClient } from "@tanstack/react-query"
import { usuariosKeys } from "../model/queryKeys"
import {
  desactivarUsuario,
  bloquearUsuario,
  resetearPassword,
  asignarUE,
  revocarUE,
} from "./api"
import type { AsignarUECommand } from "../model/types"

export function useDesactivarUsuario() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => desactivarUsuario(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: usuariosKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: usuariosKeys.lists() })
    },
  })
}

export function useBloquearUsuario() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => bloquearUsuario(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: usuariosKeys.detail(id) })
    },
  })
}

export function useReset2FA() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => resetearPassword(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: usuariosKeys.detail(id) })
    },
  })
}

export function useAsignarUE(usuarioId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: AsignarUECommand) => asignarUE(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usuariosKeys.detail(usuarioId),
      })
      queryClient.invalidateQueries({ queryKey: usuariosKeys.lists() })
    },
  })
}

export function useRevocarUE(usuarioId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ueId: number) => revocarUE(usuarioId, ueId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usuariosKeys.detail(usuarioId),
      })
      queryClient.invalidateQueries({ queryKey: usuariosKeys.lists() })
    },
  })
}
