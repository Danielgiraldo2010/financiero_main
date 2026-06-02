import { fetcher } from "@/shared/api/fetcher"
import type { CrearUECommand, UnidadEjecutoraResponse } from "../../model/types"

export function crearUnidadEjecutora(cmd: CrearUECommand): Promise<UnidadEjecutoraResponse> {
  return fetcher("/api/v1/catalogos/unidades-ejecutoras", {
    method: "POST",
    body: JSON.stringify(cmd),
  })
}
