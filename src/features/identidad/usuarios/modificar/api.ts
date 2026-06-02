// ✅ Sin cambios de interfaz — ModificarUsuarioBody ya es correcto
// Solo alineamos: nombreCompleto acepta null
import { fetcher } from "@/shared/api/fetcher"
import type { Usuario } from "../model/types"

export interface ModificarUsuarioBody {
  nombreCompleto: string | null
  email: string
  userName: string
}

export async function modificarUsuario(
  id: string,
  body: ModificarUsuarioBody
): Promise<Usuario> {
  return fetcher<Usuario>(`/api/v1/admin/usuarios/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  })
}