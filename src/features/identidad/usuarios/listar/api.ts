import { fetcher } from "@/shared/api/fetcher"
import type { PagedResult } from "@/shared/api/types"
import type { Usuario, UsuariosParams } from "../model/types"

export async function fetchUsuarios(
  params: UsuariosParams
): Promise<PagedResult<Usuario>> {
  const query = new URLSearchParams()
  if (params.email) query.set("email", params.email)
  if (params.activo !== undefined) query.set("activo", String(params.activo))
  if (params.rol) query.set("rol", params.rol)
  if (params.page) query.set("page", String(params.page))
  if (params.pageSize) query.set("pageSize", String(params.pageSize))
  const qs = query.toString()
  return fetcher<PagedResult<Usuario>>(
    `/api/v1/admin/usuarios${qs ? "?" + qs : ""}`
  )
}
