import { useQuery } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { listarConceptosNomina } from "./api"
import type { ListarCatalogosParams } from "../../model/types"

export function useConceptosNomina(params?: ListarCatalogosParams) {
  return useQuery({
    queryKey: catalogosKeys.conceptosNominaList(params),
    queryFn: () => listarConceptosNomina(params),
  })
}
