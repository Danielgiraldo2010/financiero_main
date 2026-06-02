import { useQuery } from "@tanstack/react-query"
import { normatividadKeys } from "../model/queryKeys"
import { getNormasPorDominio } from "./api"

export const useNormasPorDominio = (dominio: string) =>
  useQuery({
    queryKey: normatividadKeys.porDominio(dominio),
    queryFn: () => getNormasPorDominio(dominio),
    enabled: dominio.length > 0,
    staleTime: 300_000,
  })
