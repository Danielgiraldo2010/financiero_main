import { fetcher } from "@/shared/api/fetcher"

export function activarUnidadEjecutora(id: number): Promise<boolean> {
  return fetcher(`/api/v1/catalogos/unidades-ejecutoras/${id}/activar`, {
    method: "POST",
    body: JSON.stringify({}),
  })
}
