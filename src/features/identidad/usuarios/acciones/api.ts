import { fetcher } from "@/shared/api/fetcher"
import type { AsignarUECommand } from "../model/types"

export async function desactivarUsuario(id: string): Promise<void> {
  return fetcher<void>(`/api/v1/admin/usuarios/${id}/desactivar`, {
    method: "POST",
  })
}

export async function bloquearUsuario(id: string): Promise<void> {
  return fetcher<void>(`/api/v1/admin/usuarios/${id}/bloquear`, {
    method: "POST",
  })
}

export async function resetearPassword(id: string): Promise<void> {
  return fetcher<void>(`/api/v1/admin/usuarios/${id}/resetear-password`, {
    method: "POST",
  })
}

export async function asignarUE(body: AsignarUECommand): Promise<void> {
  return fetcher<void>(`/api/v1/admin/usuarios/${body.usuarioId}/unidades`, {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export async function revocarUE(
  usuarioId: string,
  ueId: number
): Promise<void> {
  return fetcher<void>(
    `/api/v1/admin/usuarios/${usuarioId}/unidades/${ueId}/revocar`,
    { method: "POST" }
  )
}
