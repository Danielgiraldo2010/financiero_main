import { useQuery } from "@tanstack/react-query";
import { documentosKeys } from "../model/queryKeys";
import { getDocumento, getVersionesDocumento, getHistorialDescargas } from "./api";

export function useDocumento(id: number) {
  return useQuery({
    queryKey: documentosKeys.detail(id),
    queryFn: () => getDocumento(id),
    enabled: id > 0,
  });
}

export function useVersionesDocumento(id: number) {
  return useQuery({
    queryKey: documentosKeys.versions(id),
    queryFn: () => getVersionesDocumento(id),
    enabled: id > 0,
  });
}

export function useHistorialDescargas(id: number) {
  return useQuery({
    queryKey: documentosKeys.downloads(id),
    queryFn: () => getHistorialDescargas(id),
    enabled: id > 0,
  });
}
