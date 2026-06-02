import { fetcher } from "@/shared/api/fetcher";
import type { BuscarDocumentosParams, BuscarDocumentosResult } from "../model/types";
import { mapDocumentoBusqueda, toNumber } from "../model/mappers";

export async function buscarDocumentos(
  params: BuscarDocumentosParams
): Promise<BuscarDocumentosResult> {
  const qs = new URLSearchParams();
  if (params.q) qs.set("Q", params.q);
  if (params.tipo) qs.set("Tipo", params.tipo);
  if (params.vigencia) qs.set("Vigencia", String(params.vigencia));
  qs.set("Pagina", String(params.page ?? 1));
  qs.set("ElementosPorPagina", String(params.pageSize ?? 15));

  const dto = await fetcher<Record<string, unknown>>(
    `/api/v1/documentos/buscar?${qs.toString()}`
  );

  const rawItems = (dto.items as Record<string, unknown>[]) ?? [];
  return {
    items: rawItems.map(mapDocumentoBusqueda),
    // El backend devuelve totalItems, no totalRegistros
    totalRegistros: toNumber((dto.totalItems ?? dto.totalRegistros) as number | string),
    pagina: toNumber(dto.pagina as number | string),
    tamanoPagina: toNumber(dto.tamanoPagina as number | string),
    totalPaginas: toNumber(dto.totalPaginas as number | string),
    tieneSiguiente: (dto.tieneSiguiente as boolean) ?? false,
    tieneAnterior: (dto.tieneAnterior as boolean) ?? false,
  };
}