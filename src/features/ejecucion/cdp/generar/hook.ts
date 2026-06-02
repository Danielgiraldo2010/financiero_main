// features/ejecucion/cdp/generar/hook.ts
import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import type { CdpResponse, GenerarCdpCommand } from '../model/types';
import { generarCdp } from './api';
import { cdpKeys } from '../model/queryKeys';

export function useGenerarCdp(): UseMutationResult<CdpResponse, Error, GenerarCdpCommand> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: generarCdp,
    // INVARIANTE 09a-I2: sin optimistic updates.
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: cdpKeys.lists() });
    },
  });
}
