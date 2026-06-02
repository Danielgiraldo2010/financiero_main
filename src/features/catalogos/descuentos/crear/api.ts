import { fetcher } from "@/shared/api/fetcher"
import type { CrearDescuentoCommand, DescuentoResponse } from "../../model/types"
export function crearDescuento(cmd: CrearDescuentoCommand): Promise<DescuentoResponse> {
  return fetcher("/api/v1/catalogos/descuentos", { method: "POST", body: JSON.stringify(cmd) })
}