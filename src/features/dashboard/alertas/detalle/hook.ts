import { useQuery } from "@tanstack/react-query"
import { dashboardKeys } from "../../model/queryKeys"
import { getAlerta } from "./api"

export function useAlerta(id: number) {
  return useQuery({
    queryKey: dashboardKeys.alertaDetail(id),
    queryFn: () => getAlerta(id),
    enabled: id > 0,
  })
}
