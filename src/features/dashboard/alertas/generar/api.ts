import { fetcher } from "@/shared/api/fetcher"
import type { GenerarAlertasResult } from "../../model/types"

export function generarAlertas(): Promise<GenerarAlertasResult> {
  return fetcher<GenerarAlertasResult>("/api/v1/dashboard/alertas/generar", {
    method: "POST",
    body: JSON.stringify({}),
  })
}
