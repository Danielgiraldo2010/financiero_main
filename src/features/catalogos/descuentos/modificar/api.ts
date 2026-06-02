import { fetcher } from "@/shared/api/fetcher"
import type { ModificarDescuentoCommand, DescuentoResponse } from "../../model/types"
export function modificarDescuento(cmd: ModificarDescuentoCommand): Promise<DescuentoResponse> {
  return fetcher(`/api/v1/catalogos/descuentos/${cmd.id}`, { method: "PUT", body: JSON.stringify(cmd) })
}