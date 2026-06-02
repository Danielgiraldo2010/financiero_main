import { useQuery } from "@tanstack/react-query"
import { auditoriaKeys } from "../model/queryKeys"
import { fetchAuditoria } from "./api"
import type { AuditoriaParams } from "../model/types"

export function useAuditoria(params: AuditoriaParams = {}) {
  return useQuery({
    queryKey: auditoriaKeys.list(params),
    queryFn: () => fetchAuditoria(params),
  })
}
