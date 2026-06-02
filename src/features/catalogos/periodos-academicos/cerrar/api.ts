import { fetcher } from "@/shared/api/fetcher"

export function cerrarPeriodoAcademico(id: number): Promise<void> {
  return fetcher(`/api/v1/catalogos/periodos-academicos/${id}/cerrar`, {
    method: "POST",
    body: JSON.stringify({}),
  })
}
