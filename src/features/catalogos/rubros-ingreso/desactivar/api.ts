import { fetcher } from "@/shared/api/fetcher"
export function desactivarRubroIngreso(id: number): Promise<boolean> {
  return fetcher(`/api/v1/catalogos/rubros-ingreso/${id}/desactivar`, { method: "POST", body: JSON.stringify({}) })
}