import { fetcher } from "@/shared/api/fetcher"
import type { CrearApoyoCommand, ApoyoMatriculaResponse } from "../../model/types"
export function crearApoyoMatricula(cmd: CrearApoyoCommand): Promise<ApoyoMatriculaResponse> {
  return fetcher("/api/v1/catalogos/apoyos-matricula", { method: "POST", body: JSON.stringify(cmd) })
}