import { useQuery } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { listarRubrosGasto } from "./api"
import type { ListarCatalogosParams } from "../../model/types"

export function useRubrosGasto(params?: ListarCatalogosParams) {
  return useQuery({
    queryKey: catalogosKeys.rubrosGastoList(params),
    queryFn: () => listarRubrosGasto(params),
  })
}
