// features/ejecucion/avances/legalizar/hook.ts
import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import type { LegalizarAvanceCommand } from '../model/types';
import { legalizarAvance } from './api';
import { avanceKeys } from '../model/queryKeys';

export function useLegalizarAvance(): UseMutationResult<void, Error, LegalizarAvanceCommand> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: legalizarAvance,
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: avanceKeys.lists() });
      qc.invalidateQueries({ queryKey: avanceKeys.detail(v.id) });
    },
  });
}
