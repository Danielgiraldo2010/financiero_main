// features/ejecucion/cdp/verificar/hook.ts
// INVARIANTE 09a-I1: este hook es llamado por GenerarCdpDialog al montarse.
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import type { DisponibilidadResponse, VerificarDisponibilidadCommand } from '../model/types';
import { verificarDisponibilidad } from './api';

export function useVerificarDisponibilidad(): UseMutationResult<
  DisponibilidadResponse,
  Error,
  VerificarDisponibilidadCommand
> {
  return useMutation({
    mutationFn: verificarDisponibilidad,
    // INVARIANTE 09a-I2: sin optimistic updates — pesimista.
  });
}
