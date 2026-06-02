import { fetcher } from "@/shared/api/fetcher"
import type { Usuario } from "../model/types"

export async function fetchUsuario(id: string): Promise<Usuario> {
  return fetcher<Usuario>(`/api/v1/admin/usuarios/${id}`)
}
