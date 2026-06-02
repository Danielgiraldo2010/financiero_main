import { fetcher } from "@/shared/api/fetcher"
import type { PagedResult } from "@/shared/api/types"
import type { AuditoriaParams, EventoAuditoria } from "../model/types"

export async function fetchAuditoria(
  params: AuditoriaParams
): Promise<PagedResult<EventoAuditoria>> {
  const query = new URLSearchParams()
  if (params.usuarioNombre) query.set("usuarioNombre", params.usuarioNombre)
  if (params.accion) query.set("accion", params.accion)
  if (params.entidadTipo) query.set("entidadTipo", params.entidadTipo)
  if (params.resultado) query.set("resultado", params.resultado)
  if (params.desde) query.set("desde", params.desde)
  if (params.hasta) query.set("hasta", params.hasta)
  if (params.page) query.set("page", String(params.page))
  if (params.pageSize) query.set("pageSize", String(params.pageSize))
  const qs = query.toString()
  return fetcher<PagedResult<EventoAuditoria>>(
    `/api/v1/admin/auditoria${qs ? "?" + qs : ""}`
  )
}
