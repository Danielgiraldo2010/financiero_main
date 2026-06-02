// src/features/identidad/roles/claims/api.ts
import { fetcher } from "@/shared/api/fetcher"

export interface AsignarClaimBody {
  roleName: string
  permission: string
}

export async function asignarClaim(body: AsignarClaimBody): Promise<void> {
  return fetcher<void>(`/api/v1/admin/roles/${body.roleName}/claims`, {
    method: "POST",
    body: JSON.stringify({ permission: body.permission }),
  })
}

export async function revocarClaim(
  roleName: string,
  permission: string
): Promise<void> {
  // El permission puede contener caracteres especiales — encodear
  const encoded = encodeURIComponent(permission)
  return fetcher<void>(
    `/api/v1/admin/roles/${roleName}/claims/${encoded}`,
    { method: "DELETE" }
  )
}
