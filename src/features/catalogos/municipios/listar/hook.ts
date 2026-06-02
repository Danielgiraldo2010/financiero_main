import { useQuery } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { listarMunicipios } from "./api"
import type { ListarCatalogosParams } from "../../model/types"

export function useMunicipios(params?: ListarCatalogosParams) {
  return useQuery({
    queryKey: catalogosKeys.municipiosList(params),
    queryFn: () => listarMunicipios(params),
  })
}
