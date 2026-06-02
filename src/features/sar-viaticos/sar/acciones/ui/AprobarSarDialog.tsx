import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog }          from '@/shared/ui/modal/Dialog';
import { FormField }       from '@/shared/ui/forms/FormField';
import { DatePickerField } from '@/shared/ui/forms/DatePickerField';
import { Button }          from '@/shared/ui/primitives/button';
import { AprobarSarSchema, type AprobarSarFormValues } from '../../../model/schema';
import { useAprobarSar } from '../hook';

interface Props { sarId: number; open: boolean; onClose: () => void; }

export function AprobarSarDialog({ sarId, open, onClose }: Props) {
  const mutation = useAprobarSar();
  const form = useForm<AprobarSarFormValues>({
    resolver: zodResolver(AprobarSarSchema),
    defaultValues: { numeroResolucionDec: '', fechaResolucion: '', urlResolucion: null },
  });

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(
      { id: sarId, payload: { ...data, urlResolucion: data.urlResolucion ?? null } },
      { onSuccess: () => { form.reset(); onClose(); } },
    );
  });

  return (
    <Dialog open={open} onClose={onClose} title="Aprobar SAR — Resolución de Decanatura">
      <form onSubmit={onSubmit} className="space-y-4">
        <Controller
          control={form.control}
          name="numeroResolucionDec"
          render={({ field, fieldState }) => (
            <FormField label="Número de resolución" error={fieldState.error?.message} required>
              <input
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="Ej: RES-DEC-2026-001"
                {...field}
              />
            </FormField>
          )}
        />
        <Controller
          control={form.control}
          name="fechaResolucion"
          render={({ field, fieldState }) => (
            <DatePickerField
              label="Fecha de resolución"
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={form.control}
          name="urlResolucion"
          render={({ field, fieldState }) => (
            <FormField label="URL soporte (opcional)" error={fieldState.error?.message}>
              <input
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="https://…"
                value={field.value ?? ''}
                onChange={e => field.onChange(e.target.value || null)}
              />
            </FormField>
          )}
        />
        {mutation.isError && (
          <p className="text-sm text-destructive">Error al aprobar. Intente de nuevo.</p>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Aprobando…' : 'Aprobar SAR'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
