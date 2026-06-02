// features/ejecucion/reservas/acciones/hook.ts
import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import type { EjecutarReservaCommand, AnularReservaCommand } from '../model/types';
import { ejecutarReserva, anularReserva } from './api';
import { reservaKeys } from '../model/queryKeys';

export function useEjecutarReserva(): UseMutationResult<void, Error, EjecutarReservaCommand> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ejecutarReserva,
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: reservaKeys.lists() });
      qc.invalidateQueries({ queryKey: reservaKeys.detail(v.id) });
    },
  });
}

export function useAnularReserva(): UseMutationResult<void, Error, AnularReservaCommand> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: anularReserva,
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: reservaKeys.lists() });
      qc.invalidateQueries({ queryKey: reservaKeys.detail(v.id) });
    },
  });
}
