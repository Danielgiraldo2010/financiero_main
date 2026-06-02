import { fetcher } from "@/shared/api/fetcher"
export function activarRubroGasto(id: number): Promise<boolean> {
  return fetcher(`/api/v1/catalogos/rubros-gasto/${id}/activar`, { method: "POST", body: JSON.stringify({}) })
}