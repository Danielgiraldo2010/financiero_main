import { fetcher } from "@/shared/api/fetcher"
import type { EventoAuditoria } from "../model/types"

export async function fetchEventoAuditoria(id: number): Promise<EventoAuditoria> {
  return fetcher<EventoAuditoria>(`/api/v1/admin/auditoria/${id}`)
}
