import { fetcher } from "@/shared/api/fetcher"
export function activarProgramaAcademico(id: number): Promise<boolean> {
  return fetcher(`/api/v1/catalogos/programas-academicos/${id}/activar`, { method: "POST", body: JSON.stringify({}) })
}