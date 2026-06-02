import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog }    from '@/shared/ui/modal/Dialog';
import { FormField } from '@/shared/ui/forms/FormField';
import { Button }    from '@/shared/ui/primitives/button';
import { EjecutarSarSchema, type EjecutarSarFormValues } from '../../../model/schema';
import { useEjecutarSar } from '../hook';

interface Props { sarId: number; horasAprobadas: number; open: boolean; onClose: () => void; }

export function EjecutarSarDialog({ sarId, horasAprobadas, open, onClose }: Props) {
  const mutation = useEjecutarSar();
  const form = useForm<EjecutarSarFormValues>({
    resolver: zodResolver(EjecutarSarSchema),
    defaultValues: { horasEjecutadas: horasAprobadas },
  });

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(
      { id: sarId, payload: data },
      { onSuccess: () => { form.reset(); onClose(); } },
    );
  });

  return (
    <Dialog open={open} onClose={onClose} title="Registrar Ejecución SAR">
      <form onSubmit={onSubmit} className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Horas aprobadas: <strong>{horasAprobadas}</strong>
        </p>
        <Controller
          control={form.control}
          name="horasEjecutadas"
          render={({ field, fieldState }) => (
            <FormField label="Horas realmente ejecutadas" error={fieldState.error?.message} required>
              <input type="number" min={1} max={horasAprobadas}
                className="w-full border rounded px-3 py-2 text-sm"
                value={field.value} onChange={e => field.onChange(Number(e.target.value))} />
            </FormField>
          )}
        />
        {mutation.isError && (
          <p className="text-sm text-destructive">Error al registrar ejecución.</p>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Guardando…' : 'Registrar'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
