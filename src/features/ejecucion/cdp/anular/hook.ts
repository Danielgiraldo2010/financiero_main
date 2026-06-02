// features/ejecucion/cdp/anular/hook.ts
import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import type { AnularCdpCommand } from '../model/types';
import { anularCdp } from './api';
import { cdpKeys } from '../model/queryKeys';

export function useAnularCdp(): UseMutationResult<void, Error, AnularCdpCommand> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: anularCdp,
    // INVARIANTE 09a-I2: sin optimistic updates.
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: cdpKeys.lists() });
      qc.invalidateQueries({ queryKey: cdpKeys.detail(variables.id) });
    },
  });
}
