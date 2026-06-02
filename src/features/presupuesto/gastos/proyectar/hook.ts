// features/presupuesto/gastos/proyectar/hook.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { presupuestoKeys } from '../../model/queryKeys';
import { proyectarGastos } from './api';
import type { ProyectarGastosCommand } from './api';

export function useProyectarGastos() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (command: ProyectarGastosCommand) => proyectarGastos(command),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: presupuestoKeys.gastos.all(),
      });
      void queryClient.invalidateQueries({
        queryKey: presupuestoKeys.resumen.all(),
      });
    },
  });
}
