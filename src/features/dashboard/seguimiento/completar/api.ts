import { fetcher } from "@/shared/api/fetcher"
import type { CompletarEventoResult } from "../../model/types"

export function completarEvento(id: number): Promise<CompletarEventoResult> {
  return fetcher<CompletarEventoResult>(`/api/v1/dashboard/eventos/${id}/completar`, {
    method: "POST",
    body: JSON.stringify({}),
  })
}
