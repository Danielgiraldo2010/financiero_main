import { useQuery } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { listarPeriodosAcademicos } from "./api"
import type { ListarConFiltroParams } from "../../model/types"

export function usePeriodosAcademicos(params?: ListarConFiltroParams) {
  return useQuery({
    queryKey: catalogosKeys.periodosAcademicosList(params),
    queryFn: () => listarPeriodosAcademicos(params),
  })
}
