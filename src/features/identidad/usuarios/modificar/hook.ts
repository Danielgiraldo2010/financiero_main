import { useMutation, useQueryClient } from "@tanstack/react-query"
import { usuariosKeys } from "../model/queryKeys"
import { modificarUsuario } from "./api"
// ✅ ModificarUsuarioCommand ahora tiene email + userName + nombreCompleto
// → compatible con ModificarUsuarioBody de api.ts
import type { ModificarUsuarioCommand } from "../model/types"

export function useModificarUsuario(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: ModificarUsuarioCommand) => modificarUsuario(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usuariosKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: usuariosKeys.lists() })
    },
  })
}