import type { BecaPosgradoResponse, RegistrarBecaCommand } from "../../model/types"
import { fetcher } from "@/shared/api/fetcher"

// INVARIANTE I3: vicerrectoriaDetermina siempre true — se inyecta aquí, no en el form
export async function registrarBecaPosgrado(
  body: RegistrarBecaCommand
): Promise<BecaPosgradoResponse> {
  return fetcher<BecaPosgradoResponse>("/api/v1/matriculas/becas-posgrado", {
    method: "POST",
    body: JSON.stringify({ ...body, vicerrectoriaDetermina: true }),
  })
}
