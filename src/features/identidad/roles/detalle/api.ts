// src/features/identidad/roles/detalle/api.ts
// GET /api/v1/admin/roles/{roleName} — el id en este dominio ES el nombre del rol
import { fetcher } from "@/shared/api/fetcher"
import type { Rol } from "../model/types"

export async function fetchRol(roleName: string): Promise<Rol> {
  return fetcher<Rol>(`/api/v1/admin/roles/${roleName}`)
}
