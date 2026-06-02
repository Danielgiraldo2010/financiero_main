import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog }    from '@/shared/ui/modal/Dialog';
import { FormField } from '@/shared/ui/forms/FormField';
import { Button }    from '@/shared/ui/primitives/button';
import { GenerarCdpSchema, type GenerarCdpFormValues } from '../../../model/schema';
import { useGenerarCdpSar } from '../hook';

interface Props { sarId: number; open: boolean; onClose: () => void; }

// FE8-I4 — Generar CDP es PESIMISTA: botón bloqueado mientras carga
export function GenerarCdpSarDialog({ sarId, open, onClose }: Props) {
  const mutation = useGenerarCdpSar();
  const form = useForm<GenerarCdpFormValues>({
    resolver: zodResolver(GenerarCdpSchema),
    defaultValues: { rubroGastoId: 0, fuenteRecursoId: 0 },
  });

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(
      { id: sarId, payload: data },
      { onSuccess: () => { form.reset(); onClose(); } },
    );
  });

  return (
    <Dialog open={open} onClose={onClose} title="Generar CDP — SAR">
      <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 mb-4">
        ⚠️ Esta operación es irreversible. El CDP quedará comprometido en el presupuesto.
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <Controller
          control={form.control}
          name="rubroGastoId"
          render={({ field, fieldState }) => (
            <FormField label="Rubro de gasto" error={fieldState.error?.message} required>
              <input type="number" className="w-full border rounded px-3 py-2 text-sm"
                value={field.value} onChange={e => field.onChange(Number(e.target.value))} />
            </FormField>
          )}
        />
        <Controller
          control={form.control}
          name="fuenteRecursoId"
          render={({ field, fieldState }) => (
            <FormField label="Fuente de recurso" error={fieldState.error?.message} required>
              <input type="number" className="w-full border rounded px-3 py-2 text-sm"
                value={field.value} onChange={e => field.onChange(Number(e.target.value))} />
            </FormField>
          )}
        />
        {mutation.isError && (
          <p className="text-sm text-destructive">Error al generar CDP. Intente de nuevo.</p>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Generando CDP…' : 'Generar CDP'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
