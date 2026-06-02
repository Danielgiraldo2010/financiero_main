// features/ejecucion/reportes/generar-alertas/hook.ts
//
// INVARIANTE 09c-I4:
//   - Invalida queryKey ['alertas'] para el dashboard FE11.
//   - Invalida cdpKeys.lists() porque las alertas pueden reflejar CDPs agotados.
// INVARIANTE 09c-I5:
//   - El resultado se maneja en estado local del componente — no useQuery.
//   - No hay endpoint GET de alertas en ReportesEjecucion — solo el POST de generación.
import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import type { PagedResult } from '@/shared/api/types';
import type { AlertaResponse, GenerarAlertasCommand } from '../model/types';
import { generarAlertas } from './api';
import { cdpKeys } from '../../cdp/model/queryKeys';

export function useGenerarAlertas(): UseMutationResult<
  PagedResult<AlertaResponse>,
  Error,
  GenerarAlertasCommand
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: generarAlertas,
    // INVARIANTE 09c-I4
    onSuccess: () => {
      // Invalida alertas del dashboard (FE11)
      qc.invalidateQueries({ queryKey: ['alertas'] });
      // Invalida lista de CDPs — una alerta puede indicar estado AGOTADO
      qc.invalidateQueries({ queryKey: cdpKeys.lists() });
    },
  });
}
