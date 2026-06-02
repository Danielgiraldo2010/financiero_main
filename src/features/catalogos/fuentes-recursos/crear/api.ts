import { fetcher } from "@/shared/api/fetcher"
import type { CrearFuenteCommand, FuenteRecursoResponse } from "../../model/types"

export function crearFuenteRecurso(cmd: CrearFuenteCommand): Promise<FuenteRecursoResponse> {
  return fetcher("/api/v1/catalogos/fuentes-recursos", {
    method: "POST",
    body: JSON.stringify(cmd),
  })
}
