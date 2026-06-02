import { useQuery } from "@tanstack/react-query"
import { normatividadKeys } from "../model/queryKeys"
import { consultarNorma } from "./api"

export const useNormaDetalle = (id: number) =>
  useQuery({
    queryKey: normatividadKeys.detalle(id),
    queryFn: () => consultarNorma(id),
    enabled: id > 0,
  })
