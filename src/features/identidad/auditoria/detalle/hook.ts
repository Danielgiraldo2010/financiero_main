import { useQuery } from "@tanstack/react-query"
import { auditoriaKeys } from "../model/queryKeys"
import { fetchEventoAuditoria } from "./api"

export function useEventoAuditoria(id: number) {
  return useQuery({
    queryKey: auditoriaKeys.detail(id),
    queryFn: () => fetchEventoAuditoria(id),
    enabled: id > 0,
  })
}
