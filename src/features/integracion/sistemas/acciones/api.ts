// features/integracion/sistemas/acciones/api.ts

import { fetcher } from "@/shared/api/fetcher"

export function activarSistema(id: number): Promise<void> {
  return fetcher(`/api/v1/integracion/sistemas/${id}/activar`, { method: "POST" })
}

export function desactivarSistema(id: number): Promise<void> {
  return fetcher(`/api/v1/integracion/sistemas/${id}/desactivar`, { method: "POST" })
}