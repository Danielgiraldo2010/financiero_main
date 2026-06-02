import { useQuery } from "@tanstack/react-query"
import { dashboardKeys } from "../../model/queryKeys"
import { getAlertasActivas } from "./api"

export function useAlertasActivas() {
  return useQuery({
    queryKey: dashboardKeys.alertasActivas(),
    queryFn: getAlertasActivas,
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  })
}
