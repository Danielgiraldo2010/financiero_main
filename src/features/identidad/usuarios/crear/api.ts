import { fetcher } from "@/shared/api/fetcher"
import type { CrearUsuarioCommand, Usuario } from "../model/types"

export async function crearUsuario(body: CrearUsuarioCommand): Promise<Usuario> {
  return fetcher<Usuario>("/api/v1/admin/usuarios", {
    method: "POST",
    body: JSON.stringify(body),
  })
}
