import { useQuery } from "@tanstack/react-query"
import { getCohortes, type ListarCohortesParams } from "./api"
import { matriculasKeys } from "../../model/queryKeys"

export function useCohortes(params: ListarCohortesParams = {}) {
  return useQuery({
    queryKey: matriculasKeys.cohortes(params),
    queryFn: () => getCohortes(params),
  })
}
