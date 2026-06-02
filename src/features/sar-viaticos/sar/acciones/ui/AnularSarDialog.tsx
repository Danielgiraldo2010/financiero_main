import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog }    from '@/shared/ui/modal/Dialog';
import { FormField } from '@/shared/ui/forms/FormField';
import { Button }    from '@/shared/ui/primitives/button';
import { AnularSchema, type AnularFormValues } from '../../../model/schema';
import { useAnularSar } from '../hook';

interface Props { sarId: number; open: boolean; onClose: () => void; }

export function AnularSarDialog({ sarId, open, onClose }: Props) {
  const mutation = useAnularSar();
  const form = useForm<AnularFormValues>({
    resolver: zodResolver(AnularSchema),
    defaultValues: { motivo: '' },
  });

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(
      { id: sarId, payload: data },
      { onSuccess: () => { form.reset(); onClose(); } },
    );
  });

  return (
    <Dialog open={open} onClose={onClose} title="Anular SAR">
      <form onSubmit={onSubmit} className="space-y-4">
        <Controller
          control={form.control}
          name="motivo"
          render={({ field, fieldState }) => (
            <FormField label="Motivo de anulación" error={fieldState.error?.message} required>
              <textarea className="w-full border rounded px-3 py-2 text-sm" rows={4} {...field} />
            </FormField>
          )}
        />
        {mutation.isError && (
          <p className="text-sm text-destructive">Error al anular. Intente de nuevo.</p>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="destructive" disabled={mutation.isPending}>
            {mutation.isPending ? 'Anulando…' : 'Confirmar anulación'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
