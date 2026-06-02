import { fetcher } from "@/shared/api/fetcher"
export function activarRubroIngreso(id: number): Promise<boolean> {
  return fetcher(`/api/v1/catalogos/rubros-ingreso/${id}/activar`, { method: "POST", body: JSON.stringify({}) })
}