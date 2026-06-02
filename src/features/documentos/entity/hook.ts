import { useQuery } from "@tanstack/react-query";
import { documentosKeys } from "../model/queryKeys";
import { getDocumentosPorEntidad } from "./api";

export function useDocumentosPorEntidad(tipo: string, id: number) {
  return useQuery({
    queryKey: documentosKeys.entity(tipo, id),
    queryFn: () => getDocumentosPorEntidad(tipo, id),
    enabled: !!tipo && id > 0,
  });
}
