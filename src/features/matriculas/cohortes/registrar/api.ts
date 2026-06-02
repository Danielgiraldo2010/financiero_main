import type { CohorteResponse, RegistrarCohorteCommand } from "../../model/types"
import { fetcher } from "@/shared/api/fetcher"

export async function registrarCohorte(body: RegistrarCohorteCommand): Promise<CohorteResponse> {
  return fetcher<CohorteResponse>("/api/v1/matriculas/cohortes", {
    method: "POST",
    body: JSON.stringify(body),
  })
}
