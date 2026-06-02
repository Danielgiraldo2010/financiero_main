import { useQuery } from "@tanstack/react-query"
import { getBecasPosgrado, type ListarBecasParams } from "./api"
import { matriculasKeys } from "../../model/queryKeys"

export function useBecasPosgrado(params: ListarBecasParams = {}) {
  return useQuery({
    queryKey: matriculasKeys.becasPosgrado(params),
    queryFn: () => getBecasPosgrado(params),
  })
}
