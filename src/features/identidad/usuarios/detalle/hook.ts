import { useQuery } from "@tanstack/react-query"
import { usuariosKeys } from "../model/queryKeys"
import { fetchUsuario } from "./api"

export function useUsuario(id: string) {
  return useQuery({
    queryKey: usuariosKeys.detail(id),
    queryFn: () => fetchUsuario(id),
    enabled: Boolean(id),
  })
}
