import { fetcher } from "@/shared/api/fetcher"
import type { AlertaDashboard } from "../../model/types"
import type { PagedResult } from "@/features/matriculas/model/types"

export function getAlertasActivas(): Promise<PagedResult<AlertaDashboard>> {
  return fetcher<PagedResult<AlertaDashboard>>(
    "/api/v1/dashboard/alertas/activas"
  )
}
