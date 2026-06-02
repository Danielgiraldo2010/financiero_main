import { fetcher } from '@/shared/api/fetcher';
import type { Sar } from '../../model/types';
import type {
  AprobarSarFormValues, AnularFormValues,
  EjecutarSarFormValues, GenerarCdpFormValues,
} from '../../model/schema';

export function aprobarSarDecano(id: number, payload: AprobarSarFormValues): Promise<Sar> {
  return fetcher(`/api/v1/sar/${id}/aprobar`, {
    method: 'POST',
    body:   JSON.stringify({ id, ...payload, urlResolucion: payload.urlResolucion ?? null }),
  });
}

export function anularSar(id: number, payload: AnularFormValues): Promise<Sar> {
  return fetcher(`/api/v1/sar/${id}/anular`, {
    method: 'POST',
    body:   JSON.stringify({ id, ...payload }),
  });
}

export function generarCdpSar(id: number, payload: GenerarCdpFormValues): Promise<number> {
  return fetcher(`/api/v1/sar/${id}/generar-cdp`, {
    method: 'POST',
    body:   JSON.stringify({ id, ...payload }),
  });
}

export function ejecutarSar(id: number, payload: EjecutarSarFormValues): Promise<Sar> {
  return fetcher(`/api/v1/sar/${id}/ejecutar`, {
    method: 'POST',
    body:   JSON.stringify({ id, ...payload }),
  });
}
