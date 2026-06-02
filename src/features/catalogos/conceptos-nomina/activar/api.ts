import { fetcher } from "@/shared/api/fetcher"
export function activarConceptoNomina(id: number): Promise<boolean> {
  return fetcher(`/api/v1/catalogos/conceptos-nomina/${id}/activar`, { method: "POST", body: JSON.stringify({}) })
}