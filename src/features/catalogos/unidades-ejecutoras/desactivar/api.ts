import { fetcher } from "@/shared/api/fetcher"

export function desactivarUnidadEjecutora(id: number): Promise<void> {
  return fetcher(`/api/v1/catalogos/unidades-ejecutoras/${id}/desactivar`, {
    method: "POST",
    body: JSON.stringify({}),
  })
}
