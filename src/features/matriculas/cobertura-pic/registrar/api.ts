import type { CoberturaPickResponse, RegistrarCoberturaCommand } from "../../model/types"
import { fetcher } from "@/shared/api/fetcher"

export async function registrarCoberturaPic(
  body: RegistrarCoberturaCommand
): Promise<CoberturaPickResponse> {
  return fetcher<CoberturaPickResponse>("/api/v1/matriculas/cobertura-pic", {
    method: "POST",
    body: JSON.stringify(body),
  })
}
