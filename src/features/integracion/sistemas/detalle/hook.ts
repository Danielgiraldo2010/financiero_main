// features/integracion/sistemas/detalle/hook.ts

import { useQuery } from "@tanstack/react-query"
import { integracionKeys } from "../../model/queryKeys"
import { consultarSistema } from "./api"

export function useConsultarSistema(id: number) {
  return useQuery({
    queryKey: integracionKeys.sistema(id),
    queryFn: () => consultarSistema(id),
    enabled: id > 0,
  })
}