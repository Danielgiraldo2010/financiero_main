import { fetcher } from "@/shared/api/fetcher"
import type { ModificarFuenteCommand, FuenteRecursoResponse } from "../../model/types"
export function modificarFuenteRecurso(cmd: ModificarFuenteCommand): Promise<FuenteRecursoResponse> {
  return fetcher(`/api/v1/catalogos/fuentes-recursos/${cmd.id}`, { method: "PUT", body: JSON.stringify(cmd) })
}