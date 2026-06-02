// features/ejecucion/avances/registrar/hook.ts
import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import type { AvanceLegalizacionResponse, RegistrarAvanceCommand } from '../model/types';
import { registrarAvance } from './api';
import { avanceKeys } from '../model/queryKeys';

export function useRegistrarAvance(): UseMutationResult<
  AvanceLegalizacionResponse, Error, RegistrarAvanceCommand
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: registrarAvance,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: avanceKeys.lists() });
    },
  });
}
