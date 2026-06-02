import { useQuery } from "@tanstack/react-query"
import { catalogosKeys } from "../../model/queryKeys"
import { listarTiposProyecto } from "./api"

export function useTiposProyecto() {
  return useQuery({
    queryKey: catalogosKeys.tiposProyectoList(),
    queryFn: listarTiposProyecto,
    select: (data) => data.items,  // ← extrae el array
  })
}