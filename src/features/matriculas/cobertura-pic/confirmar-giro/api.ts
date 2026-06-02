import type { CoberturaPickResponse, ConfirmarGiroCommand } from "../../model/types"
import { fetcher } from "@/shared/api/fetcher"

export async function confirmarGiroPic(
  id: number,
  body: Omit<ConfirmarGiroCommand, "id">
): Promise<CoberturaPickResponse> {
  return fetcher<CoberturaPickResponse>(
    `/api/v1/matriculas/cobertura-pic/${id}/confirmar-giro`,
    { method: "POST", body: JSON.stringify({ id, ...body }) }
  )
}
