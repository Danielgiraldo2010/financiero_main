import { useQuery } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { listarUnidadesEjecutoras } from "./api"
import type { ListarCatalogosParams } from "../../model/types"

export function useUnidadesEjecutoras(params?: ListarCatalogosParams) {
  return useQuery({
    queryKey: catalogosKeys.unidadesEjecutorasList(params),
    queryFn: () => listarUnidadesEjecutoras(params),
  })
}
