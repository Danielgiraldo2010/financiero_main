import { fetcher } from "@/shared/api/fetcher"
export function eliminarDescuento(id: number): Promise<boolean> {
  return fetcher(`/api/v1/catalogos/descuentos/${id}/eliminar`, { method: "POST", body: JSON.stringify({}) })
}