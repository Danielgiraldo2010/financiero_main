import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sarViaticosKeys } from '../../model/queryKeys';
import { registrarTarifaViatico } from './api';

export function useRegistrarTarifaViatico() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: registrarTarifaViatico,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: sarViaticosKeys.tarifas() });
    },
  });
}
