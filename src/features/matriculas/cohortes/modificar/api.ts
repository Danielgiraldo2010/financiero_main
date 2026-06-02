import type { CohorteResponse, ModificarCohorteCommand } from "../../model/types"
import { fetcher } from "@/shared/api/fetcher"

export async function modificarCohorte(
  id: number,
  body: Omit<ModificarCohorteCommand, "id">
): Promise<CohorteResponse> {
  return fetcher<CohorteResponse>(`/api/v1/matriculas/cohortes/${id}`, {
    method: "PUT",
    body: JSON.stringify({ id, ...body }),
  })
}
