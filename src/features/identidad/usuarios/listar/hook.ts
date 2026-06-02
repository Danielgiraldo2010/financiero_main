import { useQuery } from "@tanstack/react-query"
import { usuariosKeys } from "../model/queryKeys"
import { fetchUsuarios } from "./api"
import type { UsuariosParams } from "../model/types"

export function useUsuarios(params: UsuariosParams = {}) {
  return useQuery({
    queryKey: usuariosKeys.list(params),
    queryFn: () => fetchUsuarios(params),
  })
}
