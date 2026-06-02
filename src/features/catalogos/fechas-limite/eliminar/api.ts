import { fetcher } from "@/shared/api/fetcher"
export function eliminarFechaLimite(id: number): Promise<boolean> {
  return fetcher(`/api/v1/catalogos/fechas-limite/${id}/eliminar`, { method: "POST", body: JSON.stringify({}) })
}