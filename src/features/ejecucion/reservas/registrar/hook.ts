// features/ejecucion/reservas/registrar/hook.ts
import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import type { ReservaPresupuestalResponse, RegistrarReservaCommand } from '../model/types';
import { registrarReserva } from './api';
import { reservaKeys } from '../model/queryKeys';

export function useRegistrarReserva(): UseMutationResult<
  ReservaPresupuestalResponse, Error, RegistrarReservaCommand
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: registrarReserva,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: reservaKeys.lists() });
    },
  });
}
