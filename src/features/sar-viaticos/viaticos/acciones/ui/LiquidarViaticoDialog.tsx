import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog }    from '@/shared/ui/modal/Dialog';
import { FormField } from '@/shared/ui/forms/FormField';
import { Button }    from '@/shared/ui/primitives/button';
import { LiquidarViaticoSchema, type LiquidarViaticoFormValues } from '../../../model/schema';
import { useLiquidarViatico } from '../hook';

interface Props { viaticoId: number; open: boolean; onClose: () => void; }

export function LiquidarViaticoDialog({ viaticoId, open, onClose }: Props) {
  const mutation = useLiquidarViatico();
  const form = useForm<LiquidarViaticoFormValues>({
    resolver: zodResolver(LiquidarViaticoSchema),
    defaultValues: { urlSoporte: null, observaciones: null },
  });

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(
      { id: viaticoId, payload: data },
      { onSuccess: () => { form.reset(); onClose(); } },
    );
  });

  return (
    <Dialog open={open} onClose={onClose} title="Liquidar Viático">
      <form onSubmit={onSubmit} className="space-y-4">
        <Controller control={form.control} name="urlSoporte"
          render={({ field, fieldState }) => (
            <FormField label="URL soporte (opcional)" error={fieldState.error?.message}>
              <input className="w-full border rounded px-3 py-2 text-sm"
                placeholder="https://…"
                value={field.value ?? ''}
                onChange={e => field.onChange(e.target.value || null)} />
            </FormField>
          )}
        />
        <Controller control={form.control} name="observaciones"
          render={({ field, fieldState }) => (
            <FormField label="Observaciones" error={fieldState.error?.message}>
              <textarea className="w-full border rounded px-3 py-2 text-sm" rows={3}
                value={field.value ?? ''}
                onChange={e => field.onChange(e.target.value || null)} />
            </FormField>
          )}
        />
        {mutation.isError && <p className="text-sm text-destructive">Error al liquidar.</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Liquidando…' : 'Liquidar'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
