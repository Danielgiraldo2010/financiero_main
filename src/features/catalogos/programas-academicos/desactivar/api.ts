import { fetcher } from "@/shared/api/fetcher"
export function desactivarProgramaAcademico(id: number): Promise<boolean> {
  return fetcher(`/api/v1/catalogos/programas-academicos/${id}/desactivar`, { method: "POST", body: JSON.stringify({}) })
}