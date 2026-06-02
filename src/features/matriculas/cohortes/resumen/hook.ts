import { useQuery } from "@tanstack/react-query"
import { getResumenMatriculas } from "./api"
import { matriculasKeys } from "../../model/queryKeys"

export function useResumenMatriculas(vigencia: number, periodo?: string, unidadEjecutoraId?: number) {
  return useQuery({
    queryKey: matriculasKeys.resumen(vigencia, periodo),
    queryFn: () => getResumenMatriculas(vigencia, periodo, unidadEjecutoraId),
    enabled: vigencia > 0 && (unidadEjecutoraId ?? 0) > 0,
  })
}
