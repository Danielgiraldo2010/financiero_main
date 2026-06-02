import { useQuery } from "@tanstack/react-query";
import { documentosKeys } from "../model/queryKeys";
import { buscarDocumentos } from "./api";
import type { BuscarDocumentosParams } from "../model/types";

export function useBuscarDocumentos(params: BuscarDocumentosParams) {
  return useQuery({
    queryKey: documentosKeys.search(params),
    queryFn: () => buscarDocumentos(params),
    staleTime: 1000 * 30,
    placeholderData: (prev) => prev,
  });
}
