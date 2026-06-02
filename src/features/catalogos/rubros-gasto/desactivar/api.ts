import { fetcher } from "@/shared/api/fetcher"
export function desactivarRubroGasto(id: number): Promise<boolean> {
  return fetcher(`/api/v1/catalogos/rubros-gasto/${id}/desactivar`, { method: "POST", body: JSON.stringify({}) })
}