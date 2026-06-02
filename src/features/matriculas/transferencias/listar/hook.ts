import { useQuery } from "@tanstack/react-query"
import { getTransferencias, type ListarTransferenciasParams } from "./api"
import { matriculasKeys } from "../../model/queryKeys"

export function useTransferencias(params: ListarTransferenciasParams = {}) {
  return useQuery({
    queryKey: matriculasKeys.transferencias(params),
    queryFn: () => getTransferencias(params),
  })
}
