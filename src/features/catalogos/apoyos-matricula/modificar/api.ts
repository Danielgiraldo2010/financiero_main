import { fetcher } from "@/shared/api/fetcher"
import type { ModificarApoyoCommand, ApoyoMatriculaResponse } from "../../model/types"
export function modificarApoyoMatricula(cmd: ModificarApoyoCommand): Promise<ApoyoMatriculaResponse> {
  return fetcher(`/api/v1/catalogos/apoyos-matricula/${cmd.id}`, { method: "PUT", body: JSON.stringify(cmd) })
}