import { fetcher } from "@/shared/api/fetcher"
import type { AlertaDashboard } from "../../model/types"

export function getAlerta(id: number): Promise<AlertaDashboard> {
  return fetcher<AlertaDashboard>(`/api/v1/dashboard/alertas/${id}`)
}
