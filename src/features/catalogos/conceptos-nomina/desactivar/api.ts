import { fetcher } from "@/shared/api/fetcher"
export function desactivarConceptoNomina(id: number): Promise<boolean> {
  return fetcher(`/api/v1/catalogos/conceptos-nomina/${id}/desactivar`, { method: "POST", body: JSON.stringify({}) })
}