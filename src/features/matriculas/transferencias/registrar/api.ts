import type { TransferenciaInternaResponse, RegistrarTransferenciaCommand } from "../../model/types"
import { fetcher } from "@/shared/api/fetcher"

export async function registrarTransferencia(
  body: RegistrarTransferenciaCommand
): Promise<TransferenciaInternaResponse> {
  return fetcher<TransferenciaInternaResponse>("/api/v1/matriculas/transferencias", {
    method: "POST",
    body: JSON.stringify(body),
  })
}
