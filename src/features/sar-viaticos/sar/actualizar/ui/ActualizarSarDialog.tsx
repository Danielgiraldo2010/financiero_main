import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog }      from '@/shared/ui/modal/Dialog';
import { FormField }   from '@/shared/ui/forms/FormField';
import { SelectField } from '@/shared/ui/forms/SelectField';
import { Button }      from '@/shared/ui/primitives/button';
import {
  TIPOS_SAR, LABEL_TIPO_SAR,
  FUENTES_SAR, LABEL_FUENTE_SAR,
  SAR_HORAS_MAX,
} from '../../../model/constants';
import type { FuenteSar } from '../../../model/constants';
import { useActualizarSar } from '../../listar/hook';
import { useSarDetalle }    from '../../detalle/hook';

interface Props { id: number; open: boolean; onClose: () => void; }

const tipoOptions   = TIPOS_SAR.map(t => ({ value: t, label: LABEL_TIPO_SAR[t] ?? t }));
const fuenteOptions = FUENTES_SAR.map(f => ({ value: f, label: LABEL_FUENTE_SAR[f] ?? f }));

const ActualizarSarSchema = z.object({
  proyectoId:         z.number().int().positive(),
  empleadoId:         z.number().int().positive(),
  tipoSar:            z.enum(TIPOS_SAR, { message: 'Seleccione el tipo de SAR' }),
  descripcion:        z.string().min(10, 'Minimo 10 caracteres').max(500),
  horasAprobadas:     z.number().int().min(1).max(SAR_HORAS_MAX),
  valorHora:          z.number().positive('Valor hora requerido'),
  fuenteFinanciacion: z.enum(FUENTES_SAR, { message: 'Seleccione la fuente' }),
});

type FormValues = z.input<typeof ActualizarSarSchema>;

export function ActualizarSarDialog({ id, open, onClose }: Props) {
  const { data }  = useSarDetalle(id);
  const mutation  = useActualizarSar();

  const form = useForm<FormValues>({
    resolver: zodResolver(ActualizarSarSchema),
  });

  useEffect(() => {
    if (!data) return;
    form.reset({
      proyectoId:         data.proyectoId,
      empleadoId:         data.empleadoId,
      tipoSar:            data.tipoSar as FormValues['tipoSar'],
      descripcion:        data.descripcion,
      horasAprobadas:     data.horasAprobadas,
      valorHora:          data.valorHora,
      fuenteFinanciacion: data.fuenteFinanciacion as FuenteSar,
    });
  }, [data, form]);

  const onSubmit = form.handleSubmit((values: FormValues) => {
    mutation.mutate(
      { id, payload: values },
      { onSuccess: () => { form.reset(); onClose(); } },
    );
  });

  const bloqueado = data?.estado !== 'BORRADOR';

  return (
    <Dialog open={open} onClose={onClose}
      title={`Editar SAR #${id}`} maxWidth="lg">

      {bloqueado && (
        <div className="rounded-md bg-yellow-50 border border-yellow-200 px-4 py-2 text-sm text-yellow-800 mb-4">
          Este SAR esta en estado <strong>{data?.estado}</strong> y no puede editarse.
          Solo se permite editar en BORRADOR.
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Controller control={form.control} name="proyectoId"
            render={({ field, fieldState }) => (
              <FormField label="Proyecto ID" error={fieldState.error?.message}>
                <input type="number" disabled={bloqueado}
                  className="w-full border rounded px-3 py-2 text-sm disabled:opacity-50"
                  value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))} />
              </FormField>
            )}
          />
          <Controller control={form.control} name="empleadoId"
            render={({ field, fieldState }) => (
              <FormField label="Empleado ID" error={fieldState.error?.message}>
                <input type="number" disabled={bloqueado}
                  className="w-full border rounded px-3 py-2 text-sm disabled:opacity-50"
                  value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))} />
              </FormField>
            )}
          />
        </div>

        <Controller control={form.control} name="tipoSar"
          render={({ field, fieldState }) => (
            <SelectField label="Tipo SAR" options={tipoOptions}
              value={field.value} onChange={field.onChange}
              error={fieldState.error?.message} />
          )}
        />

        <Controller control={form.control} name="descripcion"
          render={({ field, fieldState }) => (
            <FormField label="Descripcion" error={fieldState.error?.message}>
              <textarea disabled={bloqueado} rows={3}
                className="w-full border rounded px-3 py-2 text-sm disabled:opacity-50"
                value={field.value ?? ''} onChange={e => field.onChange(e.target.value)} />
            </FormField>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <Controller control={form.control} name="horasAprobadas"
            render={({ field, fieldState }) => (
              <FormField label={`Horas aprobadas (max ${SAR_HORAS_MAX})`}
                error={fieldState.error?.message}>
                <input type="number" min={1} max={SAR_HORAS_MAX} disabled={bloqueado}
                  className="w-full border rounded px-3 py-2 text-sm disabled:opacity-50"
                  value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))} />
              </FormField>
            )}
          />
          <Controller control={form.control} name="valorHora"
            render={({ field, fieldState }) => (
              <FormField label="Valor hora" error={fieldState.error?.message}>
                <input type="number" min={0} disabled={bloqueado}
                  className="w-full border rounded px-3 py-2 text-sm disabled:opacity-50"
                  value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))} />
              </FormField>
            )}
          />
        </div>

        <Controller control={form.control} name="fuenteFinanciacion"
          render={({ field, fieldState }) => (
            <SelectField label="Fuente de financiacion" options={fuenteOptions}
              value={field.value} onChange={field.onChange}
              error={fieldState.error?.message} />
          )}
        />

        {mutation.isError && (
          <p className="text-sm text-destructive">Error al actualizar el SAR.</p>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          {!bloqueado && (
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          )}
        </div>
      </form>
    </Dialog>
  );
}
