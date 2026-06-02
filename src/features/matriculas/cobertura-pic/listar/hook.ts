import { useQuery } from "@tanstack/react-query"
import { getCoberturasPic } from "./api"
import { matriculasKeys } from "../../model/queryKeys"

export function useCoberturasPic(vigencia?: number) {
  return useQuery({
    queryKey: matriculasKeys.coberturaPic(vigencia),
    queryFn: () => getCoberturasPic(vigencia),
  })
}
