import { fetcher } from '@/shared/api/fetcher';
import type { PagedResult } from '@/shared/api/types';
import type { Sar } from '../../model/types';

export interface ListarSarParams {
  vigencia?:     number;
  proyecto?:     number;
  estado?:       string;
  pagina?:       number;
  tamanoPagina?: number;
}

export function listarSar(params: ListarSarParams = {}): Promise<PagedResult<Sar>> {
  const { vigencia, proyecto, estado, pagina = 1, tamanoPagina = 20 } = params;
  const qs = new URLSearchParams();
  if (vigencia) qs.set('vigencia',     String(vigencia));
  if (proyecto) qs.set('proyectoId',   String(proyecto));
  if (estado)   qs.set('estado',       estado);
  qs.set('pagina',       String(pagina));
  qs.set('tamanoPagina', String(tamanoPagina));
  return fetcher(`/api/v1/sar?${qs.toString()}`);
}

export function consultarSar(id: number): Promise<Sar> {
  return fetcher(`/api/v1/sar/${id}`);
}

export interface ActualizarSarPayload {
  proyectoId:         number;
  empleadoId:         number;
  tipoSar:            string;
  descripcion:        string;
  horasAprobadas:     number;
  valorHora:          number;
  fuenteFinanciacion: string;
}

export function actualizarSar(
  id: number,
  payload: ActualizarSarPayload,
): Promise<{ updated: boolean }> {
  return fetcher(`/api/v1/sar/${id}/actualizar`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
