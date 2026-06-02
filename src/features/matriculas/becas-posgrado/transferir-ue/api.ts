import type { BecaPosgradoResponse, RegistrarTransferenciaBecaCommand } from "../../model/types"
import { fetcher } from "@/shared/api/fetcher"

// Registra cuando Vicerrectoría Investigaciones gira al fondo de la UE
export async function registrarTransferenciaUE(
  id: number,
  body: Omit<RegistrarTransferenciaBecaCommand, "id">
): Promise<BecaPosgradoResponse> {
  return fetcher<BecaPosgradoResponse>(
    `/api/v1/matriculas/becas-posgrado/${id}/transferir-ue`,
    { method: "POST", body: JSON.stringify({ id, ...body }) }
  )
}
