import { useMutation, useQueryClient } from "@tanstack/react-query"
import { usuariosKeys } from "../model/queryKeys"
import { crearUsuario } from "./api"
import type { CrearUsuarioCommand } from "../model/types"

export function useCrearUsuario() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: CrearUsuarioCommand) => crearUsuario(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usuariosKeys.lists() })
    },
  })
}
