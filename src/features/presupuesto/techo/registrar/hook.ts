// features/presupuesto/techo/registrar/hook.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { presupuestoKeys } from '../../model/queryKeys';
import { registrarTecho } from './api';
import type { RegistrarTechoCommand } from '../../model/types';

export function useRegistrarTecho() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (command: RegistrarTechoCommand) => registrarTecho(command),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: presupuestoKeys.techo.all(),
      });
      void queryClient.invalidateQueries({
        queryKey: presupuestoKeys.resumen.all(),
      });
    },
  });
}
