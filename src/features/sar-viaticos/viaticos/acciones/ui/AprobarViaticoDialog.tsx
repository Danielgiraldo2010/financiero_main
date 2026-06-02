import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog }        from '@/shared/ui/modal/Dialog';
import { FormField }     from '@/shared/ui/forms/FormField';
import { CurrencyInput } from '@/shared/ui/forms/CurrencyInput';
import { Button }        from '@/shared/ui/primitives/button';
import { AprobarViaticoSchema, type AprobarViaticoFormValues } from '../../../model/schema';
import { useAprobarViatico } from '../hook';

interface Props { viaticoId: number; open: boolean; onClose: () => void; }

export function AprobarViaticoDialog({ viaticoId, open, onClose }: Props) {
  const mutation = useAprobarViatico();
  const form = useForm<AprobarViaticoFormValues>({
    resolver: zodResolver(AprobarViaticoSchema),
    defaultValues: { valorAprobado: 0, numeroResolucion: null },
  });

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(
      { id: viaticoId, payload: { ...data, numeroResolucion: data.numeroResolucion ?? null } },
      { onSuccess: () => { form.reset(); onClose(); } },
    );
  });

  return (
    <Dialog open={open} onClose={onClose} title="Aprobar Solicitud de Viático">
      <form onSubmit={onSubmit} className="space-y-4">
        <Controller control={form.control} name="valorAprobado"
          render={({ field, fieldState }) => (
            <FormField label="Valor aprobado" error={fieldState.error?.message} required>
              <CurrencyInput value={field.value} onChange={v => field.onChange(v ?? 0)} />
            </FormField>
          )}
        />
        <Controller control={form.control} name="numeroResolucion"
          render={({ field, fieldState }) => (
            <FormField label="Número de resolución (opcional)" error={fieldState.error?.message}>
              <input className="w-full border rounded px-3 py-2 text-sm"
                value={field.value ?? ''}
                onChange={e => field.onChange(e.target.value || null)} />
            </FormField>
          )}
        />
        {mutation.isError && <p className="text-sm text-destructive">Error al aprobar.</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Aprobando…' : 'Aprobar'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
