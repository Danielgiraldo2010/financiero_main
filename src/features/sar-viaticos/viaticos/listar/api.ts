import { fetcher } from '@/shared/api/fetcher';
import type { PagedResult } from '@/shared/api/types';
import type { ViaticoSolicitud } from '../../model/types';

export interface ListarViaticosParams {
  vigencia?:     number;
  estado?:       string;
  pagina?:       number;
  tamanoPagina?: number;
}

export function listarViaticos(
  params: ListarViaticosParams = {},
): Promise<PagedResult<ViaticoSolicitud>> {
  const { vigencia, estado, pagina = 1, tamanoPagina = 20 } = params;
  const qs = new URLSearchParams();
  if (vigencia) qs.set('vigencia',      String(vigencia));
  if (estado)   qs.set('estado',        estado);
  qs.set('pagina',       String(pagina));
  qs.set('tamanoPagina', String(tamanoPagina));
  return fetcher(`/api/v1/viaticos/solicitudes?${qs.toString()}`);
}

export function consultarViatico(id: number): Promise<ViaticoSolicitud> {
  return fetcher(`/api/v1/viaticos/solicitudes/${id}`);
}

export interface ActualizarViaticoPayload {
  proyectoId:          number;
  empleadoId:          number;
  tipoPersonal:        string;
  municipioDestinoId:  number;
  fechaSalida:         string;
  fechaRegreso:        string;
  incluyePernoctacion: boolean;
  horasEfectivasDict:  number | null;
  observaciones:       string | null;
}

export function actualizarViatico(
  id: number,
  payload: ActualizarViaticoPayload,
): Promise<{ updated: boolean }> {
  return fetcher(`/api/v1/viaticos/solicitudes/${id}/actualizar`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
