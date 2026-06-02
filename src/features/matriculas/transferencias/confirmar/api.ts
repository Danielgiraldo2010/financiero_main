import type { TransferenciaInternaResponse, ConfirmarRecepcionCommand } from "../../model/types"
import { fetcher } from "@/shared/api/fetcher"

export async function confirmarRecepcion(
  id: number,
  body: Omit<ConfirmarRecepcionCommand, "id">
): Promise<TransferenciaInternaResponse> {
  return fetcher<TransferenciaInternaResponse>(
    `/api/v1/matriculas/transferencias/${id}/confirmar`,
    { method: "POST", body: JSON.stringify({ id, ...body }) }
  )
}
