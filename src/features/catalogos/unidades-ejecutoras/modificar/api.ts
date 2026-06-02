import { fetcher } from "@/shared/api/fetcher"
import type { ModificarUECommand, UnidadEjecutoraResponse } from "../../model/types"

export function modificarUnidadEjecutora(cmd: ModificarUECommand): Promise<UnidadEjecutoraResponse> {
  return fetcher(`/api/v1/catalogos/unidades-ejecutoras/${cmd.id}`, {
    method: "PUT",
    body: JSON.stringify(cmd),
  })
}
