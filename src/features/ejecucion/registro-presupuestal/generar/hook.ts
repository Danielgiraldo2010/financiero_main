// features/ejecucion/registro-presupuestal/generar/hook.ts
import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import type { RegistroPresupuestalResponse, GenerarRpCommand } from '../model/types';
import { generarRp } from './api';
import { rpKeys } from '../model/queryKeys';

export function useGenerarRp(): UseMutationResult<
  RegistroPresupuestalResponse,
  Error,
  GenerarRpCommand
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: generarRp,
    // INVARIANTE 09a-I2: sin optimistic updates.
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: rpKeys.lists() });
    },
  });
}
