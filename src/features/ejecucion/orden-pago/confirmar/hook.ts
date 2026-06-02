// features/ejecucion/orden-pago/confirmar/hook.ts
import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import type { ConfirmarPagoOpCommand } from '../model/types';
import { confirmarPagoOp } from './api';
import { opKeys } from '../model/queryKeys';

export function useConfirmarPagoOp(): UseMutationResult<void, Error, ConfirmarPagoOpCommand> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: confirmarPagoOp,
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: opKeys.lists() });
      qc.invalidateQueries({ queryKey: opKeys.detail(variables.id) });
    },
  });
}
