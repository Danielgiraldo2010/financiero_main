// features/ejecucion/orden-pago/registrar/hook.ts
import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import type { OrdenPagoResponse, RegistrarOpCommand } from '../model/types';
import { registrarOp } from './api';
import { opKeys } from '../model/queryKeys';
import { rpKeys } from '../../registro-presupuestal/model/queryKeys';

export function useRegistrarOp(): UseMutationResult<OrdenPagoResponse, Error, RegistrarOpCommand> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: registrarOp,
    // INVARIANTE 09a-I2: sin optimistic updates.
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: opKeys.lists() });
      // Invalidar saldo del RP afectado
      qc.invalidateQueries({ queryKey: rpKeys.saldo(variables.registroPresupuestalId) });
      qc.invalidateQueries({ queryKey: rpKeys.detail(variables.registroPresupuestalId) });
    },
  });
}
